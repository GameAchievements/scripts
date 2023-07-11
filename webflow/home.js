const apiDomain = document.querySelector("meta[name=domain]")?.content;

function gamesResponseHandler(res, elemId, limit = 0) {
  const $list = $(`${elemId} .gas-list`);
  const dataTemplate = $list.children().eq(0).prop("outerHTML");
  // cleanup all other content in the list
  $list.html(dataTemplate);
  $list.children().eq(0).hide();
  console.info(`=== ${elemId} games ===`, res);
  const keysToReplace = [
    "achievements",
    "name",
    "players",
    "description",
    "externalGameId",
  ];
  let itemsArray = limit ? res.slice(0, limit) : res;
  itemsArray.forEach((item) => {
    let dataTemplateActual = dataTemplate;
    Object.entries(item).forEach(([key, value]) => {
      dataTemplateActual = $(`.gas-list-entry-cover`, dataTemplateActual)
        .css("background-image", `url(${item.imageURL})`)
        .parents(".gas-list-entry")
        .data("id", item.id)
        .prop("outerHTML");
      if (keysToReplace.includes(key)) {
        dataTemplateActual = dataTemplateActual.replaceAll(`{|${key}|}`, value);
      } else if (key === "lastPlayed") {
        dataTemplateActual = dataTemplateActual.replaceAll(
          `{|${key}|}`,
          new Date(value).toLocaleString()
        );
      } else if (key === "platform") {
        dataTemplateActual = showPlatform(value, dataTemplateActual);
      }
    });
    $list.append(dataTemplateActual);
  });
}
async function fetchGames(type) {
  const resFetch = await fetch(`https://${apiDomain}/api/game/list/${type}`);
  const resData = await resFetch.json();
  const elemId = "#gas-list-" + type;
  if (Array.isArray(resData) || resData.length > 0) {
    gamesResponseHandler(resData, elemId, 4);
  }
  setTimeout(() => {
    if (!Array.isArray(resData) || !resData.length) {
      $(`${elemId} .gas-list-empty`).show();
      return;
    }
    $(`${elemId} .gas-list`).css("display", "inherit");
  }, 300);
}
function achievementsResponseHandler(res, elemId, limit = 0) {
  const $list = $(`${elemId} .gas-list`);
  const dataTemplate = $list.children().eq(0).prop("outerHTML");
  // cleanup all other content in the list
  $list.html(dataTemplate);
  $list.children().eq(0).hide();
  console.info(`=== ${elemId} games ===`, res);
  const keysToReplace = ["id", "name", "updatedAt", "gameName", "unlockedAt"];
  let itemsArray = limit ? res.slice(0, limit) : res;
  itemsArray.forEach((item) => {
    let dataTemplateActual = dataTemplate;
    Object.entries(item).forEach(([key, value]) => {
      dataTemplateActual = $(`.gas-list-entry-cover-game`, dataTemplateActual)
        .attr("src", item.gameIconURL)
        .parents(".gas-list-entry")
        .data("id", item.id)
        .prop("outerHTML");
      dataTemplateActual = $(`.gas-list-entry-cover`, dataTemplateActual)
        .attr("src", item.iconURL)
        .parents(".gas-list-entry")
        .data("id", item.id)
        .prop("outerHTML");
      if (keysToReplace.includes(key)) {
        dataTemplateActual = dataTemplateActual.replaceAll(`{|${key}|}`, value);
      } else if (key.endsWith("At")) {
        dataTemplateActual = dataTemplateActual.replaceAll(
          `{|${key}|}`,
          new Date(value).toLocaleString()
        );
      } else if (key === "importedFromPlatform") {
        dataTemplateActual = showPlatform(value, dataTemplateActual);
      }
    });
    $list.append(dataTemplateActual);
  });
}
async function fetchAchievements(type) {
  const resFetch = await fetch(
    `https://${apiDomain}/api/achievement/list/${type}`
  );
  const resData = await resFetch.json();
  const elemId = "#gas-list-" + type;
  if (Array.isArray(resData) || resData.length > 0) {
    achievementsResponseHandler(resData, elemId, 4);
  }
  setTimeout(() => {
    if (!Array.isArray(resData) || !resData.length) {
      $(`${elemId} .gas-list-empty`).show();
      return;
    }
    $(`${elemId} .gas-list`).css("display", "inherit");
  }, 300);
}
window.onload = async () => {
  // await auth0Bootstrap();
  await Promise.all(
    ["recent", "top"].map(async (type) => await fetchGames(type))
  );
  await fetchAchievements("latest");
  setTimeout(() => {
    $(".ga-loader-container").hide();
  }, 600);
};
