const apiDomain = document.querySelector("meta[name=domain]")?.content;

let filterTxt = "All";
let $entryTemplate, $listHeader, $emptyList;

async function filterByLetter(elemId, event) {
  $(".gas-filters-sw-li", $(elemId)).removeClass("active");
  $(event.target).addClass("active");
  $(".ga-loader-container", $(elemId)).show();
  $(".gas-list,.gas-list-results-info", elemId).hide();
  filterTxt = $(event.target).text();
  await fetchGames(elemId);
  $(".gas-list-results-info", elemId).show();
  $(".ga-loader-container").hide();
}

function listResponseHandler({
  listData,
  elemId,
  numKeysToReplace,
  textKeysToReplace,
}) {
  console.info(`=== ${elemId} results ===`, listData);
  let dataTemplate = $(elemId).prop("outerHTML");
  const $list = $(`${elemId} .gas-list`);
  if (!$entryTemplate) {
    $emptyList = $(`.gas-list-empty`, $list);
    $listHeader = $list.children().first();
    $entryTemplate = $(".gas-list-entry", $list).first().clone();
    $(".gas-list-entry", $list).first().remove();
  }
  if (listData.length > 0) {
    dataTemplate = $entryTemplate.prop("outerHTML");
    $list.html($listHeader);
    listData.forEach((item, resIdx) => {
      let dataTemplateActual = dataTemplate;
      Object.entries(item).forEach(([key, value]) => {
        const $entryImg = $(`.gas-list-entry-cover`, dataTemplateActual);
        const imageURL = item.iconURL || item.imageURL;
        if ($entryImg?.length && imageURL?.length) {
          dataTemplateActual = $entryImg
            .removeAttr("srcset")
            .removeAttr("sizes")
            .attr("src", imageURL)
            .parents(".gas-list-entry")
            .prop("outerHTML");
        }
        if (textKeysToReplace.includes(key)) {
          dataTemplateActual = dataTemplateActual.replaceAll(
            `{|${key}|}`,
            (key.endsWith("At") ? gaDate(value) : value) || ""
          );
        } else if (numKeysToReplace.includes(key)) {
          dataTemplateActual = dataTemplateActual.replaceAll(
            `{|${key}|}`,
            Math.round(value || 0)
          );
        } else if (key === "importedFromPlatform") {
          dataTemplateActual = showPlatform(value, dataTemplateActual);
        } else if (key === "consoles") {
          const $tags = $(`.gas-tags-${key}`, dataTemplateActual);
          if ($tags?.length && value?.length && !value.includes("PC")) {
            dataTemplateActual = $tags
              .html(
                value
                  .map(
                    (tag) =>
                      `<div class="console-tag" title="${tag}"><div class="gas-text-overflow">${tag}</div></div>`
                  )
                  .join("\n")
              )
              .parents(".gas-list-entry")
              .prop("outerHTML");
          }
        }
      });
      $list
        .append(dataTemplateActual)
        .children()
        .last()
        .removeClass(["bg-light", "bg-dark"])
        .addClass(`bg-${resIdx % 2 > 0 ? "light" : "dark"}`);
    });
  } else {
    $list.html($emptyList);
    $emptyList.show();
  }
  $list.css("display", "flex");
}

async function fetchGames(elemId, searchTerm = "") {
  const paramsObj = {};
  if (filterTxt !== "All") {
    paramsObj.startsWith = filterTxt;
  }
  if (searchTerm.length) {
    paramsObj.q = searchTerm;
  }
  const resGames = await fetch(
    `https://${apiDomain}/api/game/list${
      Object.keys(paramsObj)?.length
        ? `?${new URLSearchParams(paramsObj).toString()}`
        : ""
    }`
  );
  const fetchData = await resGames.json();
  $(`${elemId} .gas-list-results-info`).text(
    (fetchData?.length || 0) + " result(s)"
  );
  listResponseHandler({
    listData: fetchData,
    elemId,
    numKeysToReplace: ["completion", "achievementsCount"],
    textKeysToReplace: ["id", "name", "description", "updatedAt"],
  });
}
$().ready(async () => {
  await auth0Bootstrap();
  const gamesElemId = "#gas-list-games";
  $(`${gamesElemId} .gas-filters-sw-li`).on("click", (ev) =>
    filterByLetter(gamesElemId, ev)
  );
  setupListSearch(gamesElemId, fetchGames);
  await fetchGames(gamesElemId);
  $(".ga-loader-container").hide();
});
