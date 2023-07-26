const apiDomain = document.querySelector("meta[name=domain]")?.content;

let achievementsCount = 0;
let filterTxt = "All";

function achievementsResponseHandler(res, elemId) {
  const $list = $(`${elemId} .gas-list`);
  const $listHeader = $list.children().first();
  const $entryTemplate = $(".gas-list-entry", $list).first();
  $entryTemplate.show();
  const dataTemplate = $entryTemplate.prop("outerHTML");
  $list.html($listHeader).append($entryTemplate);
  $entryTemplate.hide();
  console.info(`=== ${elemId} results ===`, res);
  const numKeysToReplace = [
    "points",
    "playersCount",
    "achieversCount",
    "completion",
    "gameTotalAchievements",
  ];
  const keysToReplace = [
    "id",
    "name",
    "gameName",
    "description",
    "updatedAt",
    "platformOriginalAchievementId",
  ];
  if (Array.isArray(res)) {
    res.forEach((item, resIdx) => {
      let dataTemplateActual = dataTemplate;
      Object.entries(item).forEach(([key, value]) => {
        const $gameImg = $(`.gas-list-entry-cover-game`, dataTemplateActual);
        if ($gameImg?.length && item.gameIconURL?.length) {
          dataTemplateActual = $gameImg
            .removeAttr("srcset")
            .removeAttr("sizes")
            .attr("src", item.gameIconURL)
            .parents(".gas-list-entry")
            .prop("outerHTML");
        }
        const $achievementImg = $(`.gas-list-entry-cover`, dataTemplateActual);
        if ($achievementImg?.length && item.iconURL?.length) {
          dataTemplateActual = $achievementImg
            .removeAttr("srcset")
            .removeAttr("sizes")
            .attr("src", item.iconURL)
            .parents(".gas-list-entry")
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
  fetchAchievements(elemId);
}
async function fetchAchievements(elemId) {
  const resAchievements = await fetch(
    `https://${apiDomain}/api/achievement/list` +
      (filterTxt === "All" ? "" : "?startsWith=" + filterTxt)
  );
  const achievementsData = await resAchievements.json();
  if (Array.isArray(achievementsData) || achievementsData.length > 0) {
    achievementsCount = achievementsData.length;
    achievementsResponseHandler(achievementsData, elemId);
  }
  setTimeout(() => {
    $(`${elemId} .ga-loader-container`).hide();
    $(`${elemId} .gas-list-header`).show();
    if (!achievementsCount) {
      $(`${elemId} .gas-list-empty`).show();
      return;
    }
    $(`${elemId} .gas-list-results-info`).text(
      achievementsCount + " result(s)"
    );
    $(`${elemId} .gas-list-results-info,${elemId} .gas-list`).show();
  }, 600);
}
$().ready(async () => {
  await auth0Bootstrap();
  const achievementsElemId = "#gas-list-achievements";
  $(`${achievementsElemId} .gas-filters-sw-li`).on("click", (ev) =>
    filterByLetter(achievementsElemId, ev)
  );
  await fetchAchievements(achievementsElemId);
});
