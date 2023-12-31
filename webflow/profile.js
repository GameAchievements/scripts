const apiDomain = document.querySelector("meta[name=domain]")?.content;
const urlParams = new URLSearchParams(location.search);
let profileId = urlParams.get("id");
const elemIdPrefix = "#gas-profile";
const fetchURLPrefix = `https://${apiDomain}/api/profile`;
const noProfileRedirectURL = "/";
const formMessageDelay = 4e3;

$(".ga-loader-container").show();
$(
  ".action-message-wrapper,#ga-sections-container,.gas-role-non-regular,.gas-role-regular," +
    `[id^=ga-pa-linked],[id^=ga-pa-to-link],[id^=${elemIdPrefix.slice(
      1
    )}-btn-avatar],[id^=${elemIdPrefix.slice(1)}-msg]`
).hide();

let platformsToLink = Array.from(["playstation", "xbox", "steam"]);

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
    if (
      confirm(
        `Your ${platform} account will no longer belong to your profile. Are you sure?`
      )
    ) {
      await fetch(`${fetchURLPrefix}/unlink-pa`, {
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
        sessionStorage.removeItem("prof");
        location.reload();
      }, formMessageDelay);
    }
  });
};

const linkPlatform = (platformName) => {
  const $toLinkCard = $(`#ga-pa-to-link-${platformName}`);
  $toLinkCard.show();
  const $linkField = $(`input[name=external]`, $toLinkCard);
  const $submitBtn = $(`input[type=submit]`, $toLinkCard);
  const $cardForm = $(`.gas-link-pa-form`, $toLinkCard);
  const $errEl = $(".gas-link-pa-error", $toLinkCard);
  $submitBtn.click(async (e) => {
    e.preventDefault();
    if (!$linkField.val()?.length) {
      $cardForm.hide();
      $errEl.css("display", "flex");
      console.error("Please fill-in the input field with an id");
      setTimeout(() => {
        $errEl.hide();
        $cardForm.css("display", "flex");
      }, formMessageDelay);
      return;
    }
    $(`input`, $toLinkCard).attr("disabled", true);
    const reqData = {
      platform: platformNameIdMap(platformName),
      external: $linkField.val(),
    };
    const resFecth = await fetch(`${fetchURLPrefix}/link-pa`, {
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
      $errEl.css("display", "flex");
      $cardForm.hide();
      console.error(paData?.message);
      setTimeout(() => {
        $errEl.hide();
        $(`input`, $toLinkCard).attr("disabled", false);
        $cardForm.css("display", "flex");
      }, formMessageDelay);
      return;
    }
    $cardForm.hide();
    $(".gas-link-pa-success", $toLinkCard)
      .attr("title", paData?.message)
      .css("display", "flex");
    setTimeout(() => {
      $toLinkCard.hide();
      unlinkPlatform({
        platform: platformName,
        accountId: paData?.platformAccount?.playerId,
        accountName: paData?.platformAccount?.playerName,
      });
      sessionStorage.removeItem("prof");
      location.reload();
    }, formMessageDelay);
  });
};

const setupLinkForms = (platformsLinked = []) => {
  $(`${elemIdPrefix}-pa-code-copied-msg`).hide();
  if (userProfileData.platformVerifierCode?.length) {
    $(`${elemIdPrefix}-pa-code`).text(userProfileData.platformVerifierCode);
    $(`${elemIdPrefix}-pa-code-btn`).on("click", async () => {
      await navigator.clipboard.writeText(userProfileData.platformVerifierCode);
      $(`${elemIdPrefix}-pa-code-copied-msg`).show();
      setTimeout(() => {
        $(`${elemIdPrefix}-pa-code-copied-msg`).hide();
      }, formMessageDelay);
    });
  } else {
    $(`${elemIdPrefix}-pa-code-btn`).hide();
  }
  platformsLinked.forEach(unlinkPlatform);
  platformsToLink.map(linkPlatform);
};

const profileAvatarUpdater = async (platformsLinked) => {
  const $msgEl = $(`${elemIdPrefix}-msg-avatar`);
  if (!platformsLinked.length) {
    displayMessage(
      $msgEl,
      "Please link first a platform account in order to choose your avatar.",
      "unstyled",
      () => {
        $msgEl.css("display", "flex");
      }
    );
  }
  platformsLinked.map(({ platform }) => {
    const platformName = platform.toLowerCase();
    $(`${elemIdPrefix}-btn-avatar-${platformName}`)
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
          displayMessage(
            $msgEl,
            "Oops! Issue changing avatar… Please try later.",
            "error"
          );
          return;
        }
        const resData = await resFetch.json();
        if (resData.imageURL?.length) {
          $(".gas-profile-avatar")
            .removeAttr("srcset")
            .removeAttr("sizes")
            .attr("src", resData.imageURL);
          displayMessage($msgEl, "Avatar successfully changed!");
        }
      });
  });
};

function profileResponseHandler(res) {
  const elemId = `${elemIdPrefix}-details`;
  let dataTemplateActual = $(`${elemId}`).prop("outerHTML");
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
    } else if (key === "ranking") {
      Object.entries(value).forEach(([rankKey, rankVal]) => {
        dataTemplateActual = dataTemplateActual.replaceAll(
          `{|${rankKey}|}`,
          rankVal
        );
      });
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
  $(`${elemId}`).prop("outerHTML", dataTemplateActual);
  // global (all sections) replacers
  if (!userAuth0Data?.sub?.length) {
    return;
  }
  profileAvatarUpdater(res.platforms);
  setupLinkForms(res.platforms);
  if (res.role?.length) {
    const isRegularRole = res.role.toLowerCase() === "regular";
    $(`.gas-role${isRegularRole ? "" : "-non"}-regular`).show();
    if (!isRegularRole) {
      const $toggleCheckbox = $(`#gas-ads-toggle`);
      if (userProfileData.adsOff) {
        $toggleCheckbox.prop("checked", true);
      }
      $toggleCheckbox.on("change", async (evt) => {
        const fetchURL = `${fetchURLPrefix}/ads`;
        const resFetch = await fetch(fetchURL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (resFetch.status !== 201) {
          // on error, reset to original state
          $toggleCheckbox.prop("checked", userProfileData.adsOff);
        }
        resData = await resFetch.json();
        if (resFetch.status === 201) {
          userProfileData.adsOff = !userProfileData.adsOff;
          sessionStorage.setItem("prof", JSON.stringify(userProfileData));
          if (resData?.message?.includes("deactivated")) {
            $(".ads-section").hide();
          } else {
            $(".ads-section").show();
          }
        }
        const msgType = resFetch.status === 201 ? "success" : "error";
        displayMessage(
          $(`#gas-ads-form .gas-form-${msgType}`),
          resData?.message,
          msgType
        );
      });
    }
  }
}

const fetchGAUserData = async () => {
  let resData;
  if (profileId?.length) {
    const fetchURL = `${fetchURLPrefix}/id/${profileId}`;
    const resFetch = await fetch(fetchURL);
    if (resFetch.status !== 200) {
      return false; // redirect
    }
    resData = await resFetch.json();
  } else if (userProfileData) {
    resData = userProfileData;
  } else {
    return false; // login
  }
  if (!resData.visible) {
    return false; // redirect
  }
  if (resData.id?.length > 0) {
    document.title = `${resData.name?.length ? resData.name : resData.id} | ${
      document.title
    }`;
    profileResponseHandler(resData);
  }
  return true;
};

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
          const imageURL = item.imageURL || item.iconURL;
          if (imageURL?.length && !isSteamImage(imageURL)) {
            const $entryImg = $(`.gas-list-entry-cover`, dataTemplateActual);
            if ($entryImg?.length) {
              dataTemplateActual =
                showImageFromSrc($entryImg, imageURL) || dataTemplateActual;
            }
          }
          if (textKeysToReplace.includes(key)) {
            dataTemplateActual = dataTemplateActual.replaceAll(
              `{|${key}|}`,
              (key.endsWith("At")
                ? gaDate(value)
                : cleanupDoubleQuotes(value)) || ""
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

$().ready(async () => {
  await auth0Bootstrap();
  if (profileId?.length) {
    $("#user-settings, #ga-user-settings-tab").hide();
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
        numKeysToReplace: ["commentsCount", "viewsCount", "likesCount"],
        textKeysToReplace: [
          "id",
          "profileId",
          "name",
          "achievementId",
          "achievementName",
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
    $("#ga-sections-container").show();
    $(`${elemIdPrefix}-btn-delete`).on("click", async function () {
      if (
        confirm(
          "This will unlink all your platforms from your profile and remove your profile. Are you sure?"
        )
      ) {
        const fetchURL = `https://${apiDomain}/api/user`;
        const resFetch = await fetch(fetchURL, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const $msgEl = $(`${elemIdPrefix}-msg-delete`);
        $(this).hide();
        if (resFetch.status !== 204) {
          displayMessage(
            $msgEl,
            "Account could not be deleted… Please try later.",
            "error",
            () => {
              $(this).show();
            }
          );
          return;
        }
        displayMessage(
          $msgEl,
          "Account is successfully being deleted… Logging out.",
          "success",
          logout
        );
      }
    });
    scrollToURLHash();
    $("#gas-wf-tab-activator").click();
    return;
  }
  if (!profileId?.length && login) {
    login();
    return;
  }
  location.replace(noProfileRedirectURL);
});
