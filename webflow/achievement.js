const apiDomain = document.querySelector("meta[name=domain]")?.content;
const urlParams = new URLSearchParams(window.location.search);
const achievementId = urlParams.get("id") || 1044;
const elemIdPrefix = `#gas-achievement`;
const formMessageDelay = 4000;
let token;
$(".ga-loader-container").show();
$("#ga-sections-container").hide();

function achievementResponseHandler(res) {
  const elemId = `${elemIdPrefix}-details`;
  const $ghContainer = $(elemId);
  let dataTemplateActual = $ghContainer.prop("outerHTML");
  console.info(`=== ${elemId} ===`, res);
  const textKeysToReplace = ["id", "name", "rarityClass"];
  const numKeysToReplace = [
    "ownersCount",
    "recentGamersCount",
    "guides",
    "rarity",
    "gaPoints",
  ];
  const achievementImg = res.coverURL || res.imageURL;
  if (achievementImg?.length) {
    dataTemplateActual = $ghContainer
      .css(
        "background-image",
        `linear-gradient(rgba(255,255,255,0),#030922),
          linear-gradient(rgba(70,89,255,.4),rgba(70,89,255,.4)),
          url(${achievementImg})`
      )
      .prop("outerHTML");
  }
  Object.entries(res).forEach(([key, value]) => {
    if (textKeysToReplace.includes(key)) {
      dataTemplateActual = dataTemplateActual.replaceAll(`{|${key}|}`, value);
    } else if (numKeysToReplace.includes(key)) {
      dataTemplateActual = dataTemplateActual.replaceAll(
        `{|${key}|}`,
        Math.round(value || 0)
      );
    } else if (key === "platform") {
      dataTemplateActual = showPlatform(value, dataTemplateActual, elemId);
    }
  });
  $ghContainer.prop("outerHTML", dataTemplateActual);
}

async function fetchAchievement() {
  const resFetch = await fetch(
    `https://${apiDomain}/api/achievement/${achievementId}`
  );
  const resData = await resFetch.json();
  if (Object.keys(resData).length > 0 && resData.id) {
    document.title = `${resData.name?.length ? resData.name : resData.id} | ${
      document.title
    }`;
    achievementResponseHandler(resData);
  }
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
      Object.entries(item).forEach(([key, value]) => {
        const $entryImg = $(`.gas-list-entry-cover`, dataTemplateActual);
        if ($entryImg && item.iconURL?.length) {
          dataTemplateActual = $entryImg
            .attr("src", item.iconURL)
            .parents(".gas-list-entry")
            .prop("outerHTML");
        }
        if (textKeysToReplace.includes(key)) {
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
}

async function listFetcher({ listName, numKeysToReplace, textKeysToReplace }) {
  const elemId = `${elemIdPrefix}-${listName}`;
  const resList = await fetch(
    `https://${apiDomain}/api/achievement/${achievementId}/${listName}`
  );
  const listData = await resList.json();
  listResponseHandler({
    listData,
    listResultsKey: listName,
    elemId,
    numKeysToReplace,
    textKeysToReplace,
  });
}

function achieversHandler({
  listsData,
  elemId,
  numKeysToReplace,
  textKeysToReplace,
}) {
  console.info(`=== ${elemId} results ===`, listsData);
  const $list = $(elemId);
  let dataTemplate = $list.prop("outerHTML");
  const $emptyList = $(`.gas-list-empty`, $list);
  const $listHeader = $list.children().first();
  const $entryTemplate = $(".gas-list-entry", $list).first();
  $list.html($listHeader);
  const listDataToRead = listsData.results;
  if (listDataToRead?.length > 0) {
    $entryTemplate.show();
    $list.append($entryTemplate);
    dataTemplate = $entryTemplate.prop("outerHTML");
    $entryTemplate.hide();
    listDataToRead.forEach((item, itemIdx) => {
      let dataTemplateActual = dataTemplate;
      Object.entries(item).forEach(([key, value]) => {
        const $entryImg = $(`.gas-list-entry-cover`, dataTemplateActual);
        if ($entryImg && item.iconURL?.length) {
          dataTemplateActual = $entryImg
            .attr("src", item.avatar)
            .parents(".gas-list-entry")
            .data("id", item.id)
            .prop("outerHTML");
        }
        dataTemplateActual = dataTemplateActual.replaceAll(
          `{|idx|}`,
          itemIdx + 1
        );
        if (key === "unlockedAt") {
          const { date, time } = gaDateTime(value);
          dataTemplateActual = dataTemplateActual.replaceAll(
            `{|unlockedDt|}`,
            date || "N.A."
          );
          dataTemplateActual = dataTemplateActual.replaceAll(
            `{|${key}|}`,
            time || "N.A."
          );
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
        .addClass(`bg-${itemIdx % 2 > 0 ? "light" : "dark"}`);
    });
  } else {
    $list.append($emptyList);
    $emptyList.show();
  }
}

async function achieversFetcher({
  listName,
  type,
  numKeysToReplace,
  textKeysToReplace,
}) {
  const elemId = `${elemIdPrefix}-${listName}-${type}`;
  const resLists = await fetch(
    `https://${apiDomain}/api/achievement/${achievementId}/${listName}?type=${type}`
  );
  const listsData = await resLists.json();
  achieversHandler({
    listsData,
    elemId,
    numKeysToReplace,
    textKeysToReplace,
  });
}

window.onload = async () => {
  await auth0Bootstrap();
  if (userAuth0Data?.sub?.length) {
    token = await auth0Client.getTokenSilently();
  }
  await fetchAchievement();
  await Promise.all([
    await listFetcher({
      listName: "guides",
      numKeysToReplace: ["id", "commentsCount", "viewsCount", "likesCount"],
      textKeysToReplace: [
        "profileId",
        "name",
        "achievementName",
        "achievementDescription",
        "author",
      ],
    }),
    await achieversFetcher({
      listName: "achievers",
      type: "first",
      numKeysToReplace: ["profileId"],
      textKeysToReplace: ["name"],
    }),
    await achieversFetcher({
      listName: "achievers",
      type: "latest",
      numKeysToReplace: ["profileId"],
      textKeysToReplace: ["name"],
    }),
  ]);
  $(".ga-loader-container").hide();
  $("#ga-sections-container").show();
  $("#gas-wf-tab-activator").click();
};