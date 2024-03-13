(() => {
  // utils/dateTIme.js
  var gaDate = (isoDate) => {
    const pad = (v) => `0${v}`.slice(-2);
    const dateObj = new Date(isoDate);
    return `${dateObj.getFullYear()} . ${pad(dateObj.getMonth() + 1)} . ${pad(
      dateObj.getDate()
    )}`;
  };

  // utils/platformNameIdMap.js
  var platformNameIdMap2 = (platformName) => {
    switch (platformName) {
      case "playstation":
        return 1;
      case "xbox":
        return 2;
      default:
        return 3;
    }
  };

  // utils/cleanupDoubleQuotes.js
  var cleanupDoubleQuotes = (content) => content?.length ? content.replace(/"(\w)/g, "\u201C$1").replace(/(\w)"/g, "$1\u201D").replaceAll('"', "'") : content;

  // utils/displayMessage.js
  var displayMessage2 = ($msgEl, msgText, type = "success", posAction = () => {
  }, formMessageDelay2 = 4e3) => {
    $msgEl.addClass(`${type}-message`).css("display", "flex");
    $("div:first-child", $msgEl).text(msgText);
    setTimeout(() => {
      $msgEl.removeClass(`${type}-message`).hide();
      posAction();
    }, formMessageDelay2);
  };

  // utils/scrollToURLHash.js
  var scrollToURLHash = () => {
    if (location.hash?.length > 0) {
      $([document.documentElement, document.body]).animate(
        { scrollTop: $(location.hash).offset().top - 50 },
        2e3
      );
    }
  };

  // utils/checkImageType.js
  var isSteamImage = (imgURL) => imgURL?.includes("steamstatic") || imgURL?.includes("steampowered");

  // utils/templateReplacers/showRarityTagAchievement.js
  var rarityClassCalc2 = (percent) => {
    if (percent < 25) {
      return "common";
    }
    if (percent < 50) {
      return "rare";
    }
    if (percent < 75) {
      return "very-rare";
    }
    if (percent >= 75) {
      return "ultra-rare";
    }
  };

  // utils/templateReplacers/showPlatform.js
  var showPlatform = (platformName, dataTemplateActual, parentSelector = ".gas-list-entry") => {
    let templateTemp = dataTemplateActual;
    const platformVerifier = {
      ps: { rgx: /playstation/gi },
      xbox: { rgx: /xbox/gi },
      steam: { rgx: /steam|pc|windows|mac|linux/gi }
    };
    if (platformVerifier.ps.rgx.test(platformName)) {
      templateTemp = $(".gas-platform-psn", templateTemp).css("display", "inherit").parents(parentSelector).prop("outerHTML");
    }
    if (platformVerifier.steam.rgx.test(platformName)) {
      templateTemp = $(".gas-platform-steam", templateTemp).css("display", "inherit").parents(parentSelector).prop("outerHTML");
    }
    if (platformVerifier.xbox.rgx.test(platformName)) {
      templateTemp = $(".gas-platform-xbox", templateTemp).css("display", "inherit").parents(parentSelector).prop("outerHTML");
    }
    return dataTemplateActual;
  };

  // utils/templateReplacers/showImageFromSrc.js
  var showImageFromSrc = ($img, url, parentSelector = ".gas-list-entry") => $img.removeAttr("srcset").removeAttr("sizes").attr("src", url).parents(parentSelector).prop("outerHTML");

  // utils/templateReplacers/ratingSVG.js
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
  function controllerSVG(svgProps = "") {
    return `<svg ${svgProps} viewBox="0 0 400 283" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M396.063 200.058C387.286 177.198 388.232 171.375 363.69 113.777C342.879 64.745 324.486 39.1518 302.256 32.5827V16.449C302.256 7.35738 294.899 0 285.807 0H260.74C251.648 0 244.291 7.35738 244.291 16.449V30.7959H155.687V16.449C155.687 7.35738 148.277 0 139.238 0H114.17C105.079 0 97.7212 7.35738 97.7212 16.449V32.5827C75.4388 39.1518 57.098 64.745 36.2345 113.777C11.6925 171.427 12.5859 177.25 3.80958 200.058C-4.91416 222.919 0.341103 257.656 30.0859 275.104C59.8833 292.499 89.6806 279.36 114.17 246.568C138.712 213.775 148.329 215.414 169.35 215.414H230.679C251.701 215.414 261.265 213.775 285.807 246.568C310.297 279.36 340.094 292.446 369.891 275.104C399.636 257.709 404.944 222.919 396.168 200.058H396.063Z" />
    </svg>`;
  }
  function ratingSVG(rate) {
    return controllerSVG(`class="bg-review-score" fill="${ratingColor(rate)}"`);
  }

  // wrappers/ProfilePage/utils/listFetcher.js
  function listResponseHandler({
    listData,
    elemId,
    numKeysToReplace,
    textKeysToReplace,
    tabCounts,
    tabMatcher
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
        )?.length
      };
    }
    const tabKeysToReplace = Object.keys(tabCounts);
    tabKeysToReplace.forEach((key) => {
      dataTemplate = dataTemplate.replaceAll(`{|${key}|}`, tabCounts[key]) || "0";
    });
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
        (tabName === "all" ? listData : listData.filter((item) => item[tabMatcher]?.toLowerCase() === tabName)).forEach((item, resIdx) => {
          let dataTemplateActual = dataTemplate;
          Object.entries(item).forEach(([key2, value]) => {
            const imageURL = item.imageURL || item.iconURL;
            if (imageURL?.length && !isSteamImage(imageURL)) {
              const $entryImg = $(`.gas-list-entry-cover`, dataTemplateActual);
              if ($entryImg?.length) {
                dataTemplateActual = showImageFromSrc($entryImg, imageURL) || dataTemplateActual;
              }
            }
            if (textKeysToReplace.includes(key2)) {
              dataTemplateActual = dataTemplateActual.replaceAll(
                `{|${key2}|}`,
                (key2.endsWith("At") ? gaDate(value) : cleanupDoubleQuotes(value)) || ""
              );
            } else if (numKeysToReplace.includes(key2)) {
              dataTemplateActual = dataTemplateActual.replaceAll(
                `{|${key2}|}`,
                Math.round(value || 0)
              );
            } else if (key2 === "rating") {
              dataTemplateActual = dataTemplateActual.replaceAll(
                `{|${key2}|}`,
                Math.round(value || 0)
              );
              const $rateWrapper = $(
                `.gas-list-entry-rating`,
                dataTemplateActual
              );
              if ($rateWrapper.length) {
                dataTemplateActual = $rateWrapper.prepend(ratingSVG(value)).parents(".gas-list-entry").prop("outerHTML");
              }
            } else if (key2 === "platform") {
              dataTemplateActual = showPlatform(value, dataTemplateActual);
            } else if (key2 === "rarity") {
              const classValue = rarityClassCalc2(value);
              dataTemplateActual = dataTemplateActual.replaceAll(
                `{|${key2}|}`,
                classValue.replace("-", " ")
              );
              dataTemplateActual = $(`.gas-rarity-tag`, dataTemplateActual).removeClass("gas-rarity-tag").addClass(`gas-rarity-tag-${classValue}`).children(".p1").addClass(classValue).parents(".gas-list-entry").prop("outerHTML");
            }
          });
          $list.append(dataTemplateActual).children().last().removeClass(["bg-light", "bg-dark"]).addClass(`bg-${resIdx % 2 > 0 ? "light" : "dark"}`);
        });
      } else {
        $list.html($emptyList);
        $emptyList.show();
      }
    });
  }
  async function listFetcher({ elemIdPrefix: elemIdPrefix4, profileId: profileId2, fetchURLPrefix: fetchURLPrefix3 }, { listName, numKeysToReplace, textKeysToReplace, tabs, tabMatcher }) {
    const elemId = `${elemIdPrefix4}-${listName}`;
    let resFetch;
    if (profileId2?.length) {
      const fetchURL = `${fetchURLPrefix3}/id/${profileId2}/${listName}`;
      resFetch = await fetch(fetchURL);
    } else if (userAuth0Data?.sub?.length) {
      resFetch = await fetch(`${fetchURLPrefix3}/my/${listName}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    const listPageData = await resFetch.json();
    const listData = listPageData?.results;
    if (listPageData?.count) {
      let tabCounts;
      if (Array.isArray(tabs)) {
        tabCounts = {};
        tabs.forEach((tabName) => {
          tabCounts[`${tabName}Cnt`] = tabName === "all" ? listData.length : listData.filter(
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
                $(revEl).text().replace(
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
        tabMatcher
      });
      return;
    }
    const $emptyList = $(`.gas-list-empty`).first().clone();
    $(`${elemId}`).html($emptyList);
    $emptyList.show();
  }

  // wrappers/ProfilePage/AchievementsData.js
  async function loadAchievements(elemIdPrefix4, profileId2, fetchURLPrefix3) {
    await listFetcher(
      { elemIdPrefix: elemIdPrefix4, profileId: profileId2, fetchURLPrefix: fetchURLPrefix3 },
      {
        listName: "achievements",
        numKeysToReplace: ["id", "score", "achieversCount", "gAPoints"],
        textKeysToReplace: ["name", "description", "updatedAt"]
      }
    );
  }

  // wrappers/ProfilePage/DeleteProfile.js
  async function deleteProfile() {
    if (confirm(
      "This will unlink all your platforms from your profile and remove your profile. Are you sure?"
    )) {
      const fetchURL = `https://${apiDomain}/api/user`;
      const resFetch = await fetch(fetchURL, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const $msgEl = $(`${elemIdPrefix}-msg-delete`);
      $(this).hide();
      if (resFetch.status !== 204) {
        displayMessage2(
          $msgEl,
          "Account could not be deleted\u2026 Please try later.",
          "error",
          () => {
            $(this).show();
          }
        );
        return;
      }
      displayMessage2(
        $msgEl,
        "Account is successfully being deleted\u2026 Logging out.",
        "success",
        logout
      );
    }
  }

  // wrappers/ProfilePage/GamesData.js
  async function loadGames(elemIdPrefix4, profileId2, fetchURLPrefix3) {
    await listFetcher(
      { elemIdPrefix: elemIdPrefix4, profileId: profileId2, fetchURLPrefix: fetchURLPrefix3 },
      {
        listName: "games",
        numKeysToReplace: [
          "id",
          "completion",
          "achievementsCount",
          "hoursPlayed"
        ],
        textKeysToReplace: ["name", "description", "updatedAt", "playedAt"]
      }
    );
  }

  // wrappers/ProfilePage/GuidesData.js
  async function loadGuides(elemIdPrefix4, profileId2, fetchURLPrefix3) {
    await listFetcher(
      { elemIdPrefix: elemIdPrefix4, profileId: profileId2, fetchURLPrefix: fetchURLPrefix3 },
      {
        listName: "guides",
        numKeysToReplace: ["commentsCount", "viewsCount", "likesCount"],
        textKeysToReplace: [
          "id",
          "profileId",
          "name",
          "achievementId",
          "achievementName",
          "achievementDescription",
          "updatedAt"
        ]
      }
    );
  }

  // wrappers/ProfilePage/ReviewsData.js
  async function loadReviews(elemIdPrefix4, profileId2, fetchURLPrefix3) {
    await listFetcher(
      { elemIdPrefix: elemIdPrefix4, profileId: profileId2, fetchURLPrefix: fetchURLPrefix3 },
      {
        listName: "reviews",
        numKeysToReplace: ["id", "likesCount", "gameId"],
        textKeysToReplace: [
          "profileId",
          "name",
          "content",
          "gameName",
          "classification",
          "updatedAt"
        ],
        tabs: ["all", "positive", "mixed", "negative"],
        tabMatcher: "classification"
      }
    );
  }

  // wrappers/ProfilePage/utils/unlinkPlatform.js
  async function unlinkPlatform({ platform, accountId, accountName }, platformsToLink2, formMessageDelay2) {
    let platformsToLinkTemp = platformsToLink2;
    const platformName = platform.toLowerCase();
    platformsToLinkTemp = platformsToLinkTemp.filter(
      (pTL) => pTL !== platformName
    );
    const $cardLinked = $(`#ga-pa-linked-${platformName}`);
    $(".gas-pa-name", $cardLinked).text(accountId).attr("title", `name: ${accountName}`);
    $cardLinked.show();
    $(".gas-unlink-pa-btn", $cardLinked).click(async (e) => {
      e.preventDefault();
      if (confirm(
        `Your ${platform} account will no longer belong to your profile. Are you sure?`
      )) {
        await fetch(`${fetchURLPrefix}/unlink-pa`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            platform: platformNameIdMap(platformName)
          })
        });
        $cardLinked.children().hide();
        $cardLinked.append(
          `<p id="ga-unlink-message" class="platform-heading">Unlinking your ${platformName} account\u2026</p>`
        ).css({
          flexGrow: 1,
          maxWidth: "25%",
          justifyContent: "center"
        });
        setTimeout(() => {
          $cardLinked.hide();
          $cardLinked.children().show();
          $("#ga-unlink-message", $cardLinked).remove();
          linkPlatform(platformName);
          sessionStorage.removeItem("prof");
          location.reload();
        }, formMessageDelay2);
      }
    });
  }

  // wrappers/ProfilePage/utils/linkPlatform.js
  async function linkPlatform2(platformName, formMessageDelay2) {
    const $toLinkCard = $(`#ga-pa-to-link-${platformName}`);
    $toLinkCard.show();
    const $linkField = $("input[name=external]", $toLinkCard);
    const $submitBtn = $("input[type=submit]", $toLinkCard);
    const $cardForm = $(".gas-link-pa-form", $toLinkCard);
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
        }, formMessageDelay2);
        return;
      }
      $("input", $toLinkCard).attr("disabled", true);
      const reqData = {
        platform: platformNameIdMap(platformName),
        external: $linkField.val()
      };
      const resFecth = await fetch(`${fetchURLPrefix}/link-pa`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(reqData)
      });
      const paData = await resFecth.json();
      if (resFecth.status !== 201) {
        $errEl.css("display", "flex");
        $cardForm.hide();
        console.error(paData?.message);
        setTimeout(() => {
          $errEl.hide();
          $("input", $toLinkCard).attr("disabled", false);
          $cardForm.css("display", "flex");
        }, formMessageDelay2);
        return;
      }
      $cardForm.hide();
      $(".gas-link-pa-success", $toLinkCard).attr("title", paData?.message).css("display", "flex");
      setTimeout(() => {
        $toLinkCard.hide();
        unlinkPlatform({
          platform: platformName,
          accountId: paData?.platformAccount?.playerId,
          accountName: paData?.platformAccount?.playerName
        });
        sessionStorage.removeItem("prof");
        location.reload();
      }, formMessageDelay2);
    });
  }

  // wrappers/ProfilePage/utils/profileAvatarUpdater.js
  async function profileAvatarUpdater(platformsLinked, elemIdPrefix4, fetchURLPrefix3) {
    const $msgEl = $(`${elemIdPrefix4}-msg-avatar`);
    if (!platformsLinked.length) {
      displayMessage2(
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
      $(`${elemIdPrefix4}-btn-avatar-${platformName}`).show().click(async function() {
        const resFetch = await fetch(`${fetchURLPrefix3}/avatar`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ platformId: platformNameIdMap2(platformName) })
        });
        if (resFetch.status !== 201) {
          displayMessage2(
            $msgEl,
            "Oops! Issue changing avatar\u2026 Please try later.",
            "error"
          );
          return;
        }
        const resData2 = await resFetch.json();
        if (resData2.imageURL?.length) {
          $(".gas-profile-avatar").removeAttr("srcset").removeAttr("sizes").attr("src", resData2.imageURL);
          displayMessage2($msgEl, "Avatar successfully changed!");
        }
      });
    });
  }

  // wrappers/ProfilePage/UserData.js
  var formMessageDelay = 4e3;
  var elemIdPrefix2 = "#gas-profile";
  var platformsToLink = Array.from(["playstation", "xbox", "steam"]);
  var setupLinkForms = (platformsLinked = []) => {
    $(`${elemIdPrefix2}-pa-code-copied-msg`).hide();
    if (userProfileData.platformVerifierCode?.length) {
      $(`${elemIdPrefix2}-pa-code`).text(userProfileData.platformVerifierCode);
      $(`${elemIdPrefix2}-pa-code-btn`).on("click", async () => {
        await navigator.clipboard.writeText(userProfileData.platformVerifierCode);
        $(`${elemIdPrefix2}-pa-code-copied-msg`).show();
        setTimeout(() => {
          $(`${elemIdPrefix2}-pa-code-copied-msg`).hide();
        }, formMessageDelay);
      });
    } else {
      $(`${elemIdPrefix2}-pa-code-btn`).hide();
    }
    for (const el of platformsLinked) {
      unlinkPlatform(el, platformsToLink, formMessageDelay);
    }
    platformsToLink.map((el) => linkPlatform2(el, formMessageDelay));
  };
  function profileResponseHandler(res, fetchURLPrefix3) {
    const elemId = `${elemIdPrefix2}-details`;
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
      "achievedCount"
    ];
    console.log("dataTemplateActual", dataTemplateActual);
    for (const [key, value] of Object.entries(res)) {
      if (textKeysToReplace.includes(key)) {
        dataTemplateActual = dataTemplateActual.replaceAll(`{|${key}|}`, value);
      } else if (key === "ranking") {
        for (const [rankKey, rankVal] of Object.entries(value)) {
          dataTemplateActual = dataTemplateActual.replaceAll(
            `{|${rankKey}|}`,
            rankVal
          );
        }
      } else if (key === "platforms") {
        for (const { platform, accountName } of value) {
          dataTemplateActual = dataTemplateActual.replaceAll(
            `{|${platform.toLowerCase()}Name|}`,
            accountName
          );
          dataTemplateActual = showPlatform(platform, dataTemplateActual, elemId);
        }
      }
    }
    $(`${elemId}`).prop("outerHTML", dataTemplateActual);
    if (!userAuth0Data?.sub?.length) {
      return;
    }
    profileAvatarUpdater(res.platforms, elemIdPrefix2, fetchURLPrefix3);
    setupLinkForms(res.platforms);
    if (res.role?.length) {
      const isRegularRole = res.role.toLowerCase() === "regular";
      $(`.gas-role${isRegularRole ? "" : "-non"}-regular`).show();
      if (!isRegularRole) {
        const $toggleCheckbox = $("#gas-ads-toggle");
        if (userProfileData.adsOff) {
          $toggleCheckbox.prop("checked", true);
        }
        $toggleCheckbox.on("change", async (evt) => {
          const fetchURL = `${fetchURLPrefix3}/ads`;
          const resFetch = await fetch(fetchURL, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });
          if (resFetch.status !== 201) {
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
  async function fetchGAUserData(fetchURLPrefix3, profileId2) {
    let resData2;
    if (profileId2?.length) {
      const fetchURL = `${fetchURLPrefix3}/id/${profileId2}`;
      const resFetch = await fetch(fetchURL);
      if (resFetch.status !== 200) {
        return false;
      }
      resData2 = await resFetch.json();
    } else if (userProfileData) {
      resData2 = userProfileData;
    } else {
      return false;
    }
    if (!resData2.visible) {
      return false;
    }
    if (resData2.id?.length > 0) {
      document.title = `${resData2.name?.length ? resData2.name : resData2.id} | ${document.title}`;
      profileResponseHandler(resData2, fetchURLPrefix3);
    }
    return true;
  }

  // webflow/profile.js
  var apiDomain2 = document.querySelector("meta[name=domain]")?.content;
  var urlParams = new URLSearchParams(location.search);
  var profileId = urlParams.get("id");
  var elemIdPrefix3 = "#gas-profile";
  var fetchURLPrefix2 = `https://${apiDomain2}/api/profile`;
  var noProfileRedirectURL = "/";
  $(".ga-loader-container").show();
  $(
    `.action-message-wrapper,#ga-sections-container,.gas-role-non-regular,.gas-role-regular,[id^=ga-pa-linked],[id^=ga-pa-to-link],[id^=${elemIdPrefix3.slice(
      1
    )}-btn-avatar],[id^=${elemIdPrefix3.slice(1)}-msg]`
  ).hide();
  $(async () => {
    await auth0Bootstrap();
    if (profileId?.length) {
      $("#user-settings, #ga-user-settings-tab").hide();
    }
    if (await fetchGAUserData(fetchURLPrefix2, profileId)) {
      await Promise.all([
        await loadGames(elemIdPrefix3, profileId, fetchURLPrefix2),
        await loadAchievements(elemIdPrefix3, profileId, fetchURLPrefix2),
        await loadGuides(elemIdPrefix3, profileId, fetchURLPrefix2),
        await loadReviews(elemIdPrefix3, profileId, fetchURLPrefix2)
      ]);
      $(".ga-loader-container").hide();
      $("#ga-sections-container").show();
      $(`${elemIdPrefix3}-btn-delete`).on("click", deleteProfile);
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
})();
