const apiDomain = document.querySelector("meta[name=domain]")?.content;

let gamesCount = 0;
let filterTxt = "All";

function gamesResponseHandler(res, elemId) {
  const $list = $(`${elemId} .gas-list`);
  const $listHeader = $list.children().first();
  const $entryTemplate = $(".gas-list-entry", $list).first();
  $entryTemplate.show();
  const dataTemplate = $entryTemplate.prop("outerHTML");
  $list.html($listHeader).append($entryTemplate);
  $entryTemplate.hide();
  console.info(`=== ${elemId} results ===`, res);
  const numKeysToReplace = ["completion", "achievementsCount"];
  const keysToReplace = ["id", "name", "description", "updatedAt"];
  if (Array.isArray(res)) {
    res.forEach((item, resIdx) => {
      let dataTemplateActual = dataTemplate;
      Object.entries(item).forEach(([key, value]) => {
        const $imgEl = $(`.gas-list-entry-cover`, dataTemplateActual);
        if ($imgEl.length) {
          dataTemplateActual = $imgEl
            .removeAttr("srcset")
            .removeAttr("sizes")
            .attr("src", item.imageURL)
            .parents(".gas-list-entry")
            .data("id", item.id)
            .prop("outerHTML");
        }
        if (keysToReplace.includes(key)) {
          dataTemplateActual = dataTemplateActual.replaceAll(
            `{|${key}|}`,
            (key.endsWith("At") ? new Date(value).toLocaleString() : value) ||
              ""
          );
        } else if (numKeysToReplace.includes(key)) {
          dataTemplateActual = dataTemplateActual.replaceAll(
            `{|${key}|}`,
            Math.round(value || 0)
          );
        } else if (key === "importedFromPlatform") {
          dataTemplateActual = showPlatform(value, dataTemplateActual);
        }
      });
      $list
        .append(dataTemplateActual)
        .children()
        .last()
        .removeClass(["bg-light", "bg-dark"])
        .addClass(`bg-${resIdx % 2 > 0 ? "light" : "dark"}`);
    });
  }
}
async function filterByLetter(elemId, event) {
  $(".gas-filters-sw-li", $(elemId)).removeClass("active");
  $(event.target).addClass("active");
  $(".ga-loader-container", $(elemId)).show();
  $(
    ".gas-list-header,.gas-list-results-info,.gas-list-empty,.gas-list",
    $(elemId)
  ).hide();
  filterTxt = $(event.target).text();
  fetchGames(elemId);
}
async function fetchGames(elemId) {
  const resGames = await fetch(
    `https://${apiDomain}/api/game/list` +
      (filterTxt === "All" ? "" : "?startsWith=" + filterTxt)
  );
  const gamesData = await resGames.json();
  if (Array.isArray(gamesData) || gamesData.length > 0) {
    gamesCount = gamesData.length;
    gamesResponseHandler(gamesData, elemId);
  }
  setTimeout(() => {
    $(`${elemId} .ga-loader-container`).hide();
    $(`${elemId} .gas-list-header`).show();
    if (!gamesCount) {
      $(`${elemId} .gas-list-empty`).show();
      return;
    }
    $(`${elemId} .gas-list-results-info`).text(gamesCount + " result(s)");
    $(`${elemId} .gas-list-results-info,${elemId} .gas-list`).show();
  }, 600);
}
window.onload = async () => {
  await auth0Bootstrap();
  const gamesElemId = "#gas-list-games";
  $(`${gamesElemId} .gas-filters-sw-li`).on("click", (ev) =>
    filterByLetter(gamesElemId, ev)
  );
  await fetchGames(gamesElemId);
};
