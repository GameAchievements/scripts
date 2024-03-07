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
  var platformNameIdMap = (platformName) => {
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

  // utils/cleanupDoubleQuotes.js
  var cleanupDoubleQuotes = (content) => content?.length ? content.replace(/"(\w)/g, "\u201C$1").replace(/(\w)"/g, "$1\u201D").replaceAll('"', "'") : content;

  // utils/displayMessage.js
  var displayMessage = ($msgEl, msgText, type = "success", posAction = () => {
  }) => {
    $msgEl.addClass(`${type}-message`).css("display", "flex");
    $("div:first-child", $msgEl).text(msgText);
    setTimeout(() => {
      $msgEl.removeClass(`${type}-message`).hide();
      posAction();
    }, formMessageDelay);
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
    } else if (percent < 50) {
      return "rare";
    } else if (percent < 75) {
      return "very-rare";
    } else if (percent >= 75) {
      return "ultra-rare";
    }
  };

  // utils/templateReplacers/showPlatform.js
  var showPlatform = (platformName, dataTemplateActual, parentSelector = ".gas-list-entry") => {
    const platformVerifier = {
      ps: { rgx: /playstation/gi },
      xbox: { rgx: /xbox/gi },
      steam: { rgx: /steam|pc|windows|mac|linux/gi }
    };
    if (platformVerifier.ps.rgx.test(platformName)) {
      dataTemplateActual = $(`.gas-platform-psn`, dataTemplateActual).css("display", "inherit").parents(parentSelector).prop("outerHTML");
    }
    if (platformVerifier.steam.rgx.test(platformName)) {
      dataTemplateActual = $(`.gas-platform-steam`, dataTemplateActual).css("display", "inherit").parents(parentSelector).prop("outerHTML");
    }
    if (platformVerifier.xbox.rgx.test(platformName)) {
      dataTemplateActual = $(`.gas-platform-xbox`, dataTemplateActual).css("display", "inherit").parents(parentSelector).prop("outerHTML");
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

  // webflow/profile.js
  var apiDomain = document.querySelector("meta[name=domain]")?.content;
  var urlParams = new URLSearchParams(location.search);
  var profileId = urlParams.get("id");
  var elemIdPrefix = "#gas-profile";
  var fetchURLPrefix = `https://${apiDomain}/api/profile`;
  var noProfileRedirectURL = "/";
  var formMessageDelay2 = 4e3;
  $(".ga-loader-container").show();
  $(
    `.action-message-wrapper,#ga-sections-container,.gas-role-non-regular,.gas-role-regular,[id^=ga-pa-linked],[id^=ga-pa-to-link],[id^=${elemIdPrefix.slice(
      1
    )}-btn-avatar],[id^=${elemIdPrefix.slice(1)}-msg]`
  ).hide();
  var platformsToLink = Array.from(["playstation", "xbox", "steam"]);
  var unlinkPlatform = ({ platform, accountId, accountName }) => {
    const platformName = platform.toLowerCase();
    platformsToLink = platformsToLink.filter((pTL) => pTL !== platformName);
    const $cardLinked = $(`#ga-pa-linked-${platformName}`);
    $(`.gas-pa-name`, $cardLinked).text(accountId).attr("title", `name: ${accountName}`);
    $cardLinked.show();
    $(`.gas-unlink-pa-btn`, $cardLinked).click(async (e) => {
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
  };
  var linkPlatform = (platformName) => {
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
        }, formMessageDelay2);
        return;
      }
      $(`input`, $toLinkCard).attr("disabled", true);
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
          $(`input`, $toLinkCard).attr("disabled", false);
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
  };
  var setupLinkForms = (platformsLinked = []) => {
    $(`${elemIdPrefix}-pa-code-copied-msg`).hide();
    if (userProfileData.platformVerifierCode?.length) {
      $(`${elemIdPrefix}-pa-code`).text(userProfileData.platformVerifierCode);
      $(`${elemIdPrefix}-pa-code-btn`).on("click", async () => {
        await navigator.clipboard.writeText(userProfileData.platformVerifierCode);
        $(`${elemIdPrefix}-pa-code-copied-msg`).show();
        setTimeout(() => {
          $(`${elemIdPrefix}-pa-code-copied-msg`).hide();
        }, formMessageDelay2);
      });
    } else {
      $(`${elemIdPrefix}-pa-code-btn`).hide();
    }
    platformsLinked.forEach(unlinkPlatform);
    platformsToLink.map(linkPlatform);
  };
  var profileAvatarUpdater = async (platformsLinked) => {
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
      $(`${elemIdPrefix}-btn-avatar-${platformName}`).show().click(async function() {
        const resFetch = await fetch(`${fetchURLPrefix}/avatar`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ platformId: platformNameIdMap(platformName) })
        });
        if (resFetch.status !== 201) {
          displayMessage(
            $msgEl,
            "Oops! Issue changing avatar\u2026 Please try later.",
            "error"
          );
          return;
        }
        const resData2 = await resFetch.json();
        if (resData2.imageURL?.length) {
          $(".gas-profile-avatar").removeAttr("srcset").removeAttr("sizes").attr("src", resData2.imageURL);
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
      "achievedCount"
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
  var fetchGAUserData = async () => {
    let resData2;
    if (profileId?.length) {
      const fetchURL = `${fetchURLPrefix}/id/${profileId}`;
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
      profileResponseHandler(resData2);
    }
    return true;
  };
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
  async function listFetcher({
    listName,
    numKeysToReplace,
    textKeysToReplace,
    tabs,
    tabMatcher
  }) {
    const elemId = `${elemIdPrefix}-${listName}`;
    let resFetch;
    if (profileId?.length) {
      const fetchURL = `${fetchURLPrefix}/id/${profileId}/${listName}`;
      resFetch = await fetch(fetchURL);
    } else if (userAuth0Data?.sub?.length) {
      resFetch = await fetch(`${fetchURLPrefix}/my/${listName}`, {
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
            "hoursPlayed"
          ],
          textKeysToReplace: ["name", "description", "updatedAt", "playedAt"]
        }),
        await listFetcher({
          listName: "achievements",
          numKeysToReplace: ["id", "score", "achieversCount", "gAPoints"],
          textKeysToReplace: ["name", "description", "updatedAt"]
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
            "updatedAt"
          ]
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
            "updatedAt"
          ],
          tabs: ["all", "positive", "mixed", "negative"],
          tabMatcher: "classification"
        })
      ]);
      $(".ga-loader-container").hide();
      $("#ga-sections-container").show();
      $(`${elemIdPrefix}-btn-delete`).on("click", async function() {
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
            displayMessage(
              $msgEl,
              "Account could not be deleted\u2026 Please try later.",
              "error",
              () => {
                $(this).show();
              }
            );
            return;
          }
          displayMessage(
            $msgEl,
            "Account is successfully being deleted\u2026 Logging out.",
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
})();
