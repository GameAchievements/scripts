// for header settings: <meta name="loginRedirectPath" content="/profile" />

const apiDomain = document.querySelector("meta[name=domain]")?.content;
const urlParams = new URLSearchParams(window.location.search);
let profileId = urlParams.get("id");
const elemIdPrefix = "#ga-profile";
const fetchURLPrefix = `https://${apiDomain}/api/profile`;
let token;
const formMessageDelay = 4000;
const platformNames = ["playstation", "xbox", "steam"];

$(".ga-loader-container").show();
$(
  "#ga-profile-sections,.gas-role-premium,.gas-role-regular,[id^=ga-pa-linked],[id^=ga-pa-to-link],[id^=ga-avatar-btn],#ga-avatar-message"
).hide();

const platformNameIdMap = (platformName) => {
  switch (platformName) {
    case "playstation":
      return 1;
    case "xbox":
      return 2;
    case "steam":
    default:
      return 3;
  }
};

let platformsToLink = Array.from(platformNames);

const unlinkPlatform = ({ platform, accountId, accountName }) => {
  const platformName = platform.toLowerCase();
  platformsToLink = platformsToLink.filter((pTL) => pTL !== platformName);
  const $cardLinked = $(`#ga-pa-linked-${platformName}`);
  $(`.gas-pa-name`, $cardLinked)
    .text(accountId)
    .attr("title", `name: ${accountName}`);
  $cardLinked.show();
  $(`.gas-unlink-pa-btn`, $cardLinked).click(async (e) => {
    e.preventDefault();

    await fetch(`https://${apiDomain}/api/profile/unlink-pa`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        platform: platformNameIdMap(platformName),
      }),
    });
    $cardLinked.children().hide();
    $cardLinked
      .append(
        `<p id="ga-unlink-message" class="platform-heading">Unlinking your ${platformName} account…</p>`
      )
      .css({
        flexGrow: 1,
        maxWidth: "25%",
        justifyContent: "center",
      });
    setTimeout(() => {
      $cardLinked.hide();
      $cardLinked.children().show();
      $("#ga-unlink-message", $cardLinked).remove();
      linkPlatform(platformName);
    }, formMessageDelay);
  });
};

const linkPlatform = (platformName) => {
  const $toLinkCard = $(`#ga-pa-to-link-${platformName}`);
  $toLinkCard.show();
  const $linkField = $(`input[name=external]`, $toLinkCard);
  const $submitBtn = $(`input[type=submit]`, $toLinkCard);
  $submitBtn.click(async (e) => {
    e.preventDefault();
    if (!$linkField.val()?.length) {
      $(".gas-link-pa-error", $toLinkCard)
        .attr("title", "Please fill-in the input field with an id")
        .show();
      setTimeout(() => {
        $(".gas-link-pa-error", $toLinkCard).hide();
      }, formMessageDelay);
      return;
    }
    $(`input`, $toLinkCard).attr("disabled", true);
    const submitText = $submitBtn.text();
    $submitBtn.text($submitBtn.data("wait"));
    const reqData = {
      platform: platformNameIdMap(platformName),
      external: $linkField.val(),
    };
    const resFecth = await fetch(`https://${apiDomain}/api/profile/link-pa`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqData),
    });
    const paData = await resFecth.json();
    if (resFecth.status !== 201) {
      const $errEl = $(".gas-link-pa-error", $toLinkCard);
      $errEl.attr("title", paData?.message).show();
      setTimeout(() => {
        $errEl.hide();
        $(`input`, $toLinkCard).attr("disabled", false);
        $submitBtn.text(submitText);
      }, formMessageDelay);
      return;
    }
    $(`input`, $toLinkCard).hide();
    $(".gas-link-pa-success", $toLinkCard)
      .attr("title", paData?.message)
      .show();
    setTimeout(() => {
      $toLinkCard.hide();
      $(`input`, $toLinkCard).attr("disabled", false).show();
      $submitBtn.text(submitText);
      $(".gas-link-pa-success", $toLinkCard).hide();
      unlinkPlatform({
        platform: platformName,
        accountId: paData?.platformAccount?.playerId,
        accountName: paData?.platformAccount?.playerName,
      });
    }, formMessageDelay);
  });
};

const formsSetup = (platformsLinked = []) => {
  platformsLinked.forEach(unlinkPlatform);
  platformsToLink.map(linkPlatform);
};

const profileAvatarUpdater = async (platformsLinked) => {
  platformsLinked.map(({ platform }) => {
    const platformName = platform.toLowerCase();
    $(`#ga-avatar-btn-${platformName}`)
      .show()
      .click(async function () {
        const resFetch = await fetch(`${fetchURLPrefix}/avatar`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ platformId: platformNameIdMap(platformName) }),
        });
        if (resFetch.status !== 201) {
          $(`#ga-avatar-message`)
            .addClass("error-message")
            .text("Oops! Issue changing avatar… Please try later.")
            .show();
          setTimeout(() => {
            $(`#ga-avatar-message`).removeClass("error-message").hide();
          }, 4000);
          return;
        }
        const resData = await resFetch.json();
        if (resData.imageURL?.length) {
          $(".gas-my-avatar")
            .removeAttr("srcset")
            .removeAttr("sizes")
            .attr("src", resData.imageURL);
          $(`#ga-avatar-message`)
            .addClass("success-message")
            .text("Avatar successfully changed")
            .show();
          setTimeout(() => {
            $(`#ga-avatar-message`).removeClass("success-message").hide();
          }, 4000);
        }
      });
  });
};
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
  Object.entries(res).forEach(([key, value]) => {
    if (textKeysToReplace.includes(key)) {
      dataTemplateActual = dataTemplateActual.replaceAll(`{|${key}|}`, value);
    } else if (key === "platforms") {
      value.forEach(({ platform, accountName }) => {
        dataTemplateActual = dataTemplateActual.replaceAll(
          `{|${platform.toLowerCase()}Name|}`,
          accountName
        );
        dataTemplateActual = showPlatform(platform, dataTemplateActual, elemId);
      });
    }
  });
  $ghContainer.prop("outerHTML", dataTemplateActual);
  // global (all sections) replacers
  if (userAuth0Data?.sub?.length) {
    profileAvatarUpdater(res.platforms);
    formsSetup(res.platforms);
  }
  if (res.imageURL?.length) {
    $(".gas-my-avatar")
      .removeAttr("srcset")
      .removeAttr("sizes")
      .attr("src", res.imageURL);
  }
  if (res.role?.length) {
    $(".gas-role-" + res.role.toLowerCase()).show();
  }
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
  let resFetch;
  if (profileId?.length) {
    const fetchURL = `${fetchURLPrefix}/id/${profileId}/${listName}`;
    resFetch = await fetch(fetchURL);
  } else if (userAuth0Data?.sub?.length) {
    resFetch = await fetch(`${fetchURLPrefix}/my/${listName}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  const listPageData = await resFetch.json();
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
  await auth0Bootstrap();
  if (profileId?.length) {
    $("#user-settings, #ga-user-settings-tab").hide();
  } else {
    token = await auth0Client.getTokenSilently();
  }
  if (await fetchGAUserData()) {
    await Promise.all([
      await listFetcher({
        listName: "games",
        numKeysToReplace: [
          "id",
          "completion",
          "achievementsCount",
          "hoursPlayed",
        ],
        textKeysToReplace: ["name", "description", "updatedAt", "playedAt"],
      }),
      await listFetcher({
        listName: "achievements",
        numKeysToReplace: ["id", "score", "achieversCount", "gAPoints"],
        textKeysToReplace: ["name", "description", "updatedAt"],
      }),
      await listFetcher({
        listName: "guides",
        numKeysToReplace: ["id", "commentsCount", "viewsCount", "likesCount"],
        textKeysToReplace: [
          "profileId",
          "name",
          "achievementDescription",
          "updatedAt",
        ],
      }),
      await listFetcher({
        listName: "reviews",
        numKeysToReplace: ["id", "likesCount", "gameId"],
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
      }),
    ]);
    $(".ga-loader-container").hide();
    $("#ga-profile-sections").show();
    $("#gas-wf-tab-activator").click();
    return;
  }
  if (!profileId.length && login) {
    login();
    return;
  }
  window.location.replace("/");
};
