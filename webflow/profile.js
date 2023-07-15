// for header settings: <meta name="loginRedirectPath" content="/profile" />

const apiDomain = document.querySelector("meta[name=domain]")?.content;
const urlParams = new URLSearchParams(window.location.search);
let profileId = urlParams.get("id");
const elemIdPrefix = "#ga-profile";
const fetchURLPrefix = `https://${apiDomain}/api/profile`;
let token;

function profileResponseHandler(res) {
  const elemId = elemIdPrefix;
  const $ghContainer = $(`${elemId}`);
  let dataTemplateActual = $ghContainer.prop("outerHTML");
  console.info(`=== ${elemId} ===`, res);
  const textKeysToReplace = [
    "name",
    "description",
    "gaPoints",
    "guidesCount",
    "gamesCount",
    "completedCount",
    "completion",
    "achievedCount",
  ];
  if (res.imageURL) {
    $(".gas-img", dataTemplateActual).each((idx, elm) => {
      dataTemplateActual = $(elm)
        .removeAttr("srcset")
        .removeAttr("sizes")
        .attr("src", res.imageURL)
        .parents(elemId)
        .prop("outerHTML");
    });
  }
  Object.entries(res).forEach(([key, value]) => {
    if (textKeysToReplace.includes(key)) {
      dataTemplateActual = dataTemplateActual.replaceAll(`{|${key}|}`, value);
    } else if (key === "platforms") {
      value.forEach(({ platform, accountId, accountName }) => {
        dataTemplateActual = dataTemplateActual.replaceAll(
          `{|${platform.toLowerCase()}Name|}`,
          accountName
        );
        dataTemplateActual = showPlatform(platform, dataTemplateActual, elemId);
      });
    }
  });
  $ghContainer.prop("outerHTML", dataTemplateActual);
}

const fetchGAUserData = async () => {
  let resFetch;
  if (profileId?.length) {
    const fetchURL = `${fetchURLPrefix}/id/${profileId}`;
    resFetch = await fetch(fetchURL);
  } else if (userAuth0Data?.sub?.length) {
    resFetch = await fetch(fetchURLPrefix, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } else {
    return false; // login
  }
  const resData = await resFetch.json();
  if (Object.keys(resData).length > 0 && resData.id) {
    document.title = `${resData.name?.length ? resData.name : resData.id} | ${
      document.title
    }`;
    profileResponseHandler(resData);
  }
  return true;
};

function ratingColor(rate) {
  switch (rate) {
    case 1:
      return "#FF6C6C";
    case 2:
      return "#FF876C";
    case 3:
      return "#FFB36C";
    case 4:
      return "#FFD66C";
    case 5:
      return "#D0FF6C";
    case 6:
      return "#6CFFCA";
    case 7:
      return "#69E4FF";
    case 8:
      return "#99A3FF";
    case 9:
      return "#C699FF";
    case 10:
      return "#FFA0EA";
    default:
      return "#5663BA";
  }
}

function ratingSVG(rate) {
  return `<svg class="bg-review-score" viewBox="0 0 400 283" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M396.063 200.058C387.286 177.198 388.232 171.375 363.69 113.777C342.879 64.745 324.486 39.1518 302.256 32.5827V16.449C302.256 7.35738 294.899 0 285.807 0H260.74C251.648 0 244.291 7.35738 244.291 16.449V30.7959H155.687V16.449C155.687 7.35738 148.277 0 139.238 0H114.17C105.079 0 97.7212 7.35738 97.7212 16.449V32.5827C75.4388 39.1518 57.098 64.745 36.2345 113.777C11.6925 171.427 12.5859 177.25 3.80958 200.058C-4.91416 222.919 0.341103 257.656 30.0859 275.104C59.8833 292.499 89.6806 279.36 114.17 246.568C138.712 213.775 148.329 215.414 169.35 215.414H230.679C251.701 215.414 261.265 213.775 285.807 246.568C310.297 279.36 340.094 292.446 369.891 275.104C399.636 257.709 404.944 222.919 396.168 200.058H396.063Z"
      fill="${ratingColor(rate)}"/>
    </svg>`;
}

function listResponseHandler({
  listData,
  elemId,
  numKeysToReplace,
  textKeysToReplace,
  tabCounts,
  tabMatcher,
}) {
  const $listTabs = $(`${elemId} .gas-list-tabs`);
  console.info(`=== ${elemId} results ===`, listData);
  let dataTemplate = $listTabs.prop("outerHTML");
  if (!tabCounts) {
    tabMatcher = "platform";
    tabCounts = {
      allCnt: listData.length,
      playstationCnt: listData.filter(
        (item) => item[tabMatcher].toLowerCase() === "playstation"
      )?.length,
      xboxCnt: listData.filter(
        (item) => item[tabMatcher].toLowerCase() === "xbox"
      )?.length,
      steamCnt: listData.filter(
        (item) => item[tabMatcher].toLowerCase() === "steam"
      )?.length,
    };
  }
  const tabKeysToReplace = Object.keys(tabCounts);
  tabKeysToReplace.forEach((key) => {
    dataTemplate = dataTemplate.replaceAll(`{|${key}|}`, tabCounts[key]) || "0";
  });
  // replace counts
  $listTabs.prop("outerHTML", dataTemplate);
  tabKeysToReplace.forEach((key) => {
    const tabName = key.slice(0, key.indexOf("Cnt"));
    const $list = $(`${elemId} .gas-list-${tabName}`);
    const $emptyList = $(`.gas-list-empty`, $list);
    if (tabCounts[key] > 0) {
      const $listHeader = $list.children().first();
      const $entryTemplate = $(".gas-list-entry", $list).first();
      $entryTemplate.show();
      dataTemplate = $entryTemplate.prop("outerHTML");
      $list.html($listHeader).append($entryTemplate);
      $entryTemplate.hide();
      (tabName === "all"
        ? listData
        : listData.filter((item) => item[tabMatcher]?.toLowerCase() === tabName)
      ).forEach((item, resIdx) => {
        let dataTemplateActual = dataTemplate;
        Object.entries(item).forEach(([key, value]) => {
          const $entryImg = $(`.gas-list-entry-cover`, dataTemplateActual);
          if ($entryImg?.length && item.iconURL?.length) {
            dataTemplateActual = $entryImg
              .removeAttr("srcset")
              .removeAttr("sizes")
              .attr("src", item.iconURL)
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
          } else if (key === "rating") {
            dataTemplateActual = dataTemplateActual.replaceAll(
              `{|${key}|}`,
              Math.round(value || 0)
            );
            const $rateWrapper = $(
              `.gas-list-entry-rating`,
              dataTemplateActual
            );
            if ($rateWrapper.length) {
              dataTemplateActual = $rateWrapper
                .prepend(ratingSVG(value))
                .parents(".gas-list-entry")
                .prop("outerHTML");
            }
          } else if (key === "platform") {
            dataTemplateActual = showPlatform(value, dataTemplateActual);
          } else if (key === "rarity") {
            const classValue = rarityClassCalc(value);
            dataTemplateActual = dataTemplateActual.replaceAll(
              `{|${key}|}`,
              classValue.replace("-", " ")
            );
            dataTemplateActual = $(`.gas-rarity-tag`, dataTemplateActual)
              .removeClass("gas-rarity-tag")
              .addClass(`gas-rarity-tag-${classValue}`)
              .children(".p1")
              .addClass(classValue)
              .parents(".gas-list-entry")
              .prop("outerHTML");
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
  });
}

async function listFetcher({
  listName,
  numKeysToReplace,
  textKeysToReplace,
  tabs,
  tabMatcher,
}) {
  const elemId = `${elemIdPrefix}-${listName}`;
  const resList = await fetch(`${fetchURLPrefix}/id/${profileId}/${listName}`);
  const listPageData = await resList.json();
  const listData = listPageData?.results;
  if (listPageData?.count) {
    let tabCounts;
    if (Array.isArray(tabs)) {
      tabCounts = {};
      tabs.forEach((tabName) => {
        tabCounts[`${tabName}Cnt`] =
          tabName === "all"
            ? listData.length
            : listData.filter(
                (item) => item[tabMatcher]?.toLowerCase() === tabName
              )?.length;
      });
    }
    switch (listName) {
      case "reviews":
        $(`.gas-count-reviews`).each((idx, revEl) => {
          $(revEl).text(
            $(revEl).text().replace("{|reviewsCnt|}", listData.length)
          );
          if (idx > 0) {
            $(revEl).text(
              $(revEl)
                .text()
                .replace(
                  `{|${tabs[idx]}ReviewsCnt|}`,
                  tabCounts[`${tabs[idx]}Cnt`]
                )
            );
          }
        });
        break;
      default:
        break;
    }
    listResponseHandler({
      listData,
      elemId,
      numKeysToReplace,
      textKeysToReplace,
      tabCounts,
      tabMatcher,
    });
    return;
  }
  const $emptyList = $(`.gas-list-empty`).first().clone();
  $(`${elemId}`).html($emptyList);
  $emptyList.show();
}

window.onload = async () => {
  $(".ga-loader").show();
  await auth0Bootstrap();
  token = await auth0Client.getTokenSilently();
  if (await fetchGAUserData()) {
    $(".ga-loader").hide();

    await listFetcher({
      listName: "achievements",
      numKeysToReplace: ["id", "score", "achieversCount", "gAPoints"],
      textKeysToReplace: ["name", "description", "updatedAt"],
    });
    await listFetcher({
      listName: "guides",
      numKeysToReplace: ["id", "commentsCount", "viewsCount", "likesCount"],
      textKeysToReplace: ["profileId", "name", "description", "updatedAt"],
    });
    await listFetcher({
      listName: "reviews",
      numKeysToReplace: ["id", "likesCount"],
      textKeysToReplace: [
        "profileId",
        "name",
        "content",
        "gameName",
        "classification",
        "updatedAt",
      ],
      tabs: ["all", "positive", "mixed", "negative"],
      tabMatcher: "classification",
    });
    $("#gas-wf-tab-activator").click();
    return;
  }
  if (login) {
    login();
    return;
  }
  window.location.replace("/");
};
