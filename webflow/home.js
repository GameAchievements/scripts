const apiDomain = document.querySelector("meta[name=domain]")?.content;
const forumDomain = document.querySelector("meta[name=forum-domain]")?.content;
const elemIdPrefix = `#gas-home`;

function listResponseHandler({
  listData,
  elemId,
  numKeysToReplace,
  textKeysToReplace,
}) {
  console.info(`=== ${elemId} results ===`, listData);
  let dataTemplate = $(elemId).prop("outerHTML");
  const $list = $(`${elemId} .gas-list`);
  const $emptyList = $(`${elemId} .gas-list-empty`);
  const $entryTemplate = $(".gas-list-entry", $list).first();
  $entryTemplate.show();
  dataTemplate = $entryTemplate.prop("outerHTML");
  $entryTemplate.hide();
  if (listData?.length && dataTemplate?.length) {
    $list.html($entryTemplate);
    listData.forEach((item, resIdx) => {
      let dataTemplateActual = dataTemplate;
      dataTemplateActual = dataTemplateActual.replaceAll(`{|idx|}`, resIdx + 1);
      Object.entries(item).forEach(([key, value]) => {
        if (item.gameIconURL?.length && !isSteamImage(item.gameIconURL)) {
          const $gameImg = $(`.gas-list-entry-cover-game`, dataTemplateActual);
          if ($gameImg?.length) {
            dataTemplateActual =
              showImageFromSrc($gameImg, item.gameIconURL) ||
              dataTemplateActual;
          }
        }
        if (
          (item.iconURL?.length || item.imageURL?.length) &&
          !isXboxEdsImage(item.imageURL) &&
          !isSteamImage(item.imageURL) &&
          !isSteamImage(item.iconURL)
        ) {
          const $entryImg = $(`.gas-list-entry-cover`, dataTemplateActual);
          if ($entryImg?.length) {
            dataTemplateActual = elemId.includes("list-games")
              ? $entryImg
                  .css("background-image", `url(${item.imageURL})`)
                  .parents(".gas-list-entry")
                  .prop("outerHTML")
              : showImageFromSrc($entryImg, item.iconURL || item.imageURL) ||
                dataTemplateActual;
          }
        }
        if (textKeysToReplace.includes(key)) {
          dataTemplateActual = dataTemplateActual.replaceAll(
            `{|${key}|}`,
            (key.endsWith("At") ? gaDate(value) : cleanupDoubleQuotes(value)) ||
              ""
          );
        } else if (numKeysToReplace.includes(key)) {
          dataTemplateActual = dataTemplateActual.replaceAll(
            `{|${key}|}`,
            Math.round(value || 0)
          );
        } else if (key === "lastPlayed") {
          dataTemplateActual = dataTemplateActual.replaceAll(
            `{|${key}|}`,
            gaDate(value)
          );
        } else if (key === "importedFromPlatform" || key === "platform") {
          dataTemplateActual = showPlatform(value, dataTemplateActual);
        }
      });
      $list.append(dataTemplateActual);
    });
  } else {
    if (listData?.length && !dataTemplate?.length) {
      console.error(`${elemId} template issue (missing a '.gas-' class?)`);
    }
    $(elemId).html($emptyList);
    $emptyList.show();
  }
  $list.css("display", "flex");
}

async function fetchGames(type) {
  const resFetch = await fetch(`https://${apiDomain}/api/game/list/${type}`);
  let listData = [];
  if (resFetch.ok) {
    const resData = await resFetch.json();
    listData = resData?.slice(0, 4);
  }
  const elemId = `${elemIdPrefix}-list-games-${type}`;
  listResponseHandler({
    listData,
    elemId,
    numKeysToReplace: ["id", "players", "achievements"],
    textKeysToReplace: [
      "id",
      "name",
      "description",
      "lastPlayed",
      "externalGameId",
    ],
  });
  $(`${elemId} .ga-loader-container`).hide();
}

async function fetchGuides() {
  const resFetch = await fetch(
    `https://${apiDomain}/api/guide/list?perPage=5&orderBy=createdAt:desc`
  );
  let listData = [];
  if (resFetch.ok) {
    const resData = await resFetch.json();
    listData = resData.results?.slice(0, 4);
  }
  const elemId = `${elemIdPrefix}-list-guides`;
  listResponseHandler({
    listData,
    elemId,
    numKeysToReplace: ["id", "comments", "likes"],
    textKeysToReplace: ["name", "author", "description", "profileId"],
  });
  $(`${elemId} .ga-loader-container`).hide();
}

async function fetchAchievements() {
  const resFetch = await fetch(
    `https://${apiDomain}/api/achievement/list/latest`
  );
  let listData = [];
  if (resFetch.ok) {
    const resData = await resFetch.json();
    listData = resData.slice(0, 4);
  }
  const elemId = `${elemIdPrefix}-list-achievements-latest`;
  listResponseHandler({
    listData,
    elemId,
    numKeysToReplace: ["id"],
    textKeysToReplace: [
      "name",
      "description",
      "updatedAt",
      "gameName",
      "unlockedAt",
    ],
  });
  $(`${elemId} .ga-loader-container`).hide();
}

async function fetchLatestThreads() {
  const resFetch = await fetch(
    `https://${forumDomain}/api/recent`
  );
  let listData = [];
  if (resFetch.ok) {
    const resData = (await resFetch.json()).topics;
    listData = resData.slice(0, 4);
  }
  listData = listData.map(e => ({
    id: e.cid,
    title: e.title,
    topic_id: e.tid,
    author_name: e.user.username,
    imageURL: (e.user.picture?.toLowerCase().includes('http') ?
      new DOMParser().parseFromString(e.user.picture, "text/html").documentElement.textContent :
      'https://uploads-ssl.webflow.com/6455fdc10a7247f51c568c32/64b50ee999d75d5f75a28b08_user%20avatar%20default.svg'),
    category_name: e.category.name,
    category_id: e.category.cid,
    views: e.viewcount,
    upvotes: e.upvotes,
    replies: e.postcount
  }));
  const elemId = `${elemIdPrefix}-forum-threads`;
  listResponseHandler({
    listData,
    elemId,
    numKeysToReplace: ["replies", "views", "upvotes"],
    textKeysToReplace: ["title", "author_name", "category_name", "topic_id", "category_id"],
  });
  $(`${elemId} .ga-loader-container`).hide();
}

$().ready(async () => {
  $(`.ga-loader-container`).show();
  await auth0Bootstrap();
  await Promise.all(
    ["recent", "top"].map(async (type) => await fetchGames(type))
  );
  await fetchGuides();
  await fetchAchievements();
  await fetchLatestThreads();
});
