const apiDomain = document.querySelector("meta[name=domain]")?.content;

let achievementsCount = 0;
let filterTxt = "All";
let $entryTemplate, $listHeader, $emptyList;

async function filterByLetter(elemId, event) {
  $(".gas-filters-sw-li", $(elemId)).removeClass("active");
  $(event.target).addClass("active");
  $(".ga-loader-container", $(elemId)).show();
  $(".gas-list,.gas-list-results-info", elemId).hide();
  filterTxt = $(event.target).text();
  await fetchAchievements(elemId);
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
        const $gameImg = $(`.gas-list-entry-cover-game`, dataTemplateActual);
        if ($gameImg?.length && item.gameIconURL?.length) {
          // TODO: why is WF adding gas-list-entry-cover to this element?
          $gameImg.removeClass("gas-list-entry-cover");
          dataTemplateActual = $gameImg
            .removeAttr("srcset")
            .removeAttr("sizes")
            .attr("src", item.gameIconURL)
            .parents(".gas-list-entry")
            .prop("outerHTML");
        }
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
        } else if (key === "rarityClass") {
          dataTemplateActual = dataTemplateActual.replaceAll(
            `{|${key}|}`,
            value || ""
          );
          if (value.toLowerCase() !== "common") {
            const classValue = value.replace(" ", "-")?.toLowerCase();
            dataTemplateActual = $(`.gas-rarity-tag`, dataTemplateActual)
              .removeClass("gas-rarity-tag")
              .addClass(`gas-rarity-tag-${classValue}`)
              .children(".p1")
              .addClass(classValue)
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

async function fetchAchievements(elemId, searchTerm = "") {
  const paramsObj = {};
  if (filterTxt !== "All") {
    paramsObj.startsWith = filterTxt;
  }
  if (searchTerm.length) {
    paramsObj.q = searchTerm;
  }
  const resAchievements = await fetch(
    `https://${apiDomain}/api/achievement/list${
      Object.keys(paramsObj)?.length
        ? `?${new URLSearchParams(paramsObj).toString()}`
        : ""
    }`
  );
  const fetchData = await resAchievements.json();
  $(`${elemId} .gas-list-results-info`).text(
    (fetchData?.length || 0) + " result(s)"
  );
  listResponseHandler({
    listData: fetchData,
    elemId,
    numKeysToReplace: [
      "id",
      "gameId",
      "points",
      "playersCount",
      "achieversCount",
      "completion",
      "gameTotalAchievements",
    ],
    textKeysToReplace: [
      "name",
      "gameName",
      "description",
      "updatedAt",
      "platformOriginalAchievementId",
    ],
  });
}
$().ready(async () => {
  await auth0Bootstrap();
  const achievementsElemId = "#gas-list-achievements";
  $(`${achievementsElemId} .gas-filters-sw-li`).on("click", (ev) =>
    filterByLetter(achievementsElemId, ev)
  );
  setupListSearch(achievementsElemId, fetchAchievements);
  await fetchAchievements(achievementsElemId);
  $(".ga-loader-container").hide();
});
