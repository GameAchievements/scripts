const apiDomain = document.querySelector("meta[name=domain]")?.content;
const featureName = "leaderboard";
const elemId = `#gas-${featureName}`;
const formMessageDelay = 4000;
let token;
$(".ga-loader-container").show();
$("#ga-sections-container").hide();

let paramPlatformId = 0;
switch (window.location.pathname) {
  case `/playstation-${featureName}`:
    paramPlatformId = 1;
    break;
  case `/xbox-${featureName}`:
    paramPlatformId = 2;
    break;
  case `/steam-${featureName}`:
    paramPlatformId = 3;
    break;

  default:
    break;
}

function listResponseHandler({
  listData,
  listResultsKey,
  elemId,
  numKeysToReplace,
  textKeysToReplace,
}) {
  console.info(`=== ${elemId} results ===`, listData);
  let dataTemplate = $(elemId).prop("outerHTML");
  const $list = $(`${elemId} .gas-list`);
  const $emptyList = $(`.gas-list-empty`, $list);
  if (listData.count > 0 && listData[listResultsKey]?.length) {
    const $listHeader = $list.children().first();
    const $entryTemplate = $(".gas-list-entry", $list).first();
    $entryTemplate.show();
    dataTemplate = $entryTemplate.prop("outerHTML");
    $list.html($listHeader).append($entryTemplate);
    $entryTemplate.hide();
    listData[listResultsKey].forEach((item, resIdx) => {
      let dataTemplateActual = dataTemplate;
      dataTemplateActual = dataTemplateActual.replaceAll(`{|idx|}`, resIdx + 1);
      Object.entries(item).forEach(([key, value]) => {
        if (key === "iconURL") {
          const $profileImg = $(`.gas-list-entry-cover`, dataTemplateActual);
          if ($profileImg?.length && value?.length) {
            dataTemplateActual = $profileImg
              .removeAttr("srcset")
              .removeAttr("sizes")
              .attr("src", value)
              .parents(".gas-list-entry")
              .prop("outerHTML");
          }
        } else if (key === "recentlyPlayed") {
          if (!paramPlatformId && value?.platform?.length) {
            // only GA leaderboard shows the platform tag
            dataTemplateActual = showPlatform(
              value?.platform,
              dataTemplateActual
            );
          }
          const $gameImg = $(`.gas-list-entry-cover-game`, dataTemplateActual);
          if ($gameImg?.length && value?.iconURL?.length) {
            dataTemplateActual = $gameImg
              .removeAttr("srcset")
              .removeAttr("sizes")
              .attr("src", value.iconURL)
              .parents(".gas-list-entry")
              .prop("outerHTML");
          }
        } else if (textKeysToReplace.includes(key)) {
          dataTemplateActual = dataTemplateActual.replaceAll(
            `{|${key}|}`,
            value || ""
          );
        } else if (numKeysToReplace.includes(key)) {
          dataTemplateActual = dataTemplateActual.replaceAll(
            `{|${key}|}`,
            Math.round(value || 0)
          );
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
  $list.show();
}

window.onload = async () => {
  await auth0Bootstrap();
  if (userAuth0Data?.sub?.length) {
    token = await auth0Client.getTokenSilently();
  }
  const resList = await fetch(
    `https://${apiDomain}/api/${featureName}${
      paramPlatformId ? `?type=${paramPlatformId}` : ""
    }`
  );
  const listData = await resList.json();
  const textKeysToReplace = ["profileId", "name"];
  const numKeysToReplace = ["totalAchievements", "gaPoints"];
  switch (paramPlatformId) {
    case 1:
      numKeysToReplace.push("silver", "bronze", "gold", "platinum");
      break;
    case 2:
      numKeysToReplace.push("gamescore");
      break;
    case 3:
      numKeysToReplace.push("games");
      break;
  }
  listResponseHandler({
    listData,
    listResultsKey: "profiles",
    elemId,
    numKeysToReplace,
    textKeysToReplace,
  });
  $(".ga-loader-container").hide();
  $("#ga-sections-container").show();
};
