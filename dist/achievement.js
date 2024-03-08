(() => {
  // components/AchievementPage/VerifyAuthUserGuideData.js
  async function verifyAuthenticatedUserGuideData(elemIdPrefix2, token2, apiDomain2, achievementId2) {
    $(`${elemIdPrefix2}-btn-guide-edit`).hide();
    if (!token2) {
      return;
    }
    const resFetch = await fetch(
      `https://${apiDomain2}/api/achievement/${achievementId2}/guide-auth-user-data`,
      { headers: { Authorization: `Bearer ${token2}` } }
    );
    if (resFetch.status !== 200) {
      return;
    }
    const revData = await resFetch.json();
    if (revData?.ownedGuideId > 0) {
      $(`${elemIdPrefix2}-btn-guide-create`).hide();
      $(`${elemIdPrefix2}-btn-guide-edit`).attr("href", `/guide-form?id=${revData.ownedGuideId}`).show();
    }
  }

  // utils/dateTIme.js
  var gaDateTime = (isoDate) => {
    const dateObj = new Date(isoDate);
    const month = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    const date = dateObj.getDate() + " " + month[dateObj.getMonth()] + ", " + dateObj.getFullYear();
    const time = dateObj.toLocaleTimeString().toLowerCase();
    return { date, time };
  };

  // utils/cleanupDoubleQuotes.js
  var cleanupDoubleQuotes = (content) => content?.length ? content.replace(/"(\w)/g, "\u201C$1").replace(/(\w)"/g, "$1\u201D").replaceAll('"', "'") : content;

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
  var showRarityTagAchievement = (percentageNumber, dataTemplateActual, parent = ".hero-section-achievement") => {
    const classValue = rarityClassCalc2(percentageNumber);
    dataTemplateActual = $(`.rarity-tag-wrapper`, dataTemplateActual).children(`:not(.gas-rarity-tag-${classValue})`).hide().parents(parent).prop("outerHTML");
    return dataTemplateActual;
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

  // components/AchievementPage/AchieversSection.js
  function achieversHandler({
    listsData,
    listResultsKey,
    elemId,
    textKeysToReplace
  }) {
    console.info(`=== ${elemId} results ===`, listsData);
    const $list = $(elemId);
    let dataTemplate = $list.prop("outerHTML");
    const $emptyList = $(`.gas-list-empty`, $list);
    const $listHeader = $list.children().first();
    const $entryTemplate = $(".gas-list-entry", $list).first();
    $list.html($listHeader);
    const listDataToRead = listsData[listResultsKey];
    if (listDataToRead?.length > 0) {
      $entryTemplate.show();
      $list.append($entryTemplate);
      dataTemplate = $entryTemplate.prop("outerHTML");
      $entryTemplate.hide();
      listDataToRead.forEach((item, itemIdx) => {
        let dataTemplateActual = dataTemplate;
        Object.entries(item).forEach(([key, value]) => {
          const $entryImg = $(`.gas-list-entry-cover`, dataTemplateActual);
          if ($entryImg?.length && item.iconURL?.length) {
            dataTemplateActual = showImageFromSrc($entryImg, item.iconURL) || dataTemplateActual;
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
          }
        });
        $list.append(dataTemplateActual).children().last().removeClass(["bg-light", "bg-dark"]).addClass(`bg-${itemIdx % 2 > 0 ? "light" : "dark"}`);
      });
    } else {
      $list.append($emptyList);
      $emptyList.show();
    }
    $list.show();
  }
  async function achieversFetcher({ elemIdPrefix: elemIdPrefix2, apiDomain: apiDomain2, achievementId: achievementId2 }, { listName, type, textKeysToReplace }) {
    const elemId = `${elemIdPrefix2}-${listName}-${type === "last" ? "latest" : type}`;
    const resLists = await fetch(
      `https://${apiDomain2}/api/achievement/${achievementId2}/${listName}?type=${type}`
    );
    const listsData = await resLists.json();
    achieversHandler({
      listsData,
      listResultsKey: listName,
      elemId,
      textKeysToReplace
    });
  }
  var loadAchieversSection = async (elemIdPrefix2, apiDomain2, achievementId2) => {
    await achieversFetcher(
      { elemIdPrefix: elemIdPrefix2, apiDomain: apiDomain2, achievementId: achievementId2 },
      {
        listName: "achievers",
        type: "first",
        textKeysToReplace: ["name", "profileId"]
      }
    );
    await achieversFetcher(
      { elemIdPrefix: elemIdPrefix2, apiDomain: apiDomain2, achievementId: achievementId2 },
      {
        listName: "achievers",
        type: "last",
        textKeysToReplace: ["name", "profileId"]
      }
    );
  };

  // components/AchievementPage/GuidesSection.js
  function listResponseHandler({
    listData,
    listResultsKey,
    elemId,
    numKeysToReplace,
    textKeysToReplace
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
          if ($entryImg?.length && item.iconURL?.length) {
            dataTemplateActual = showImageFromSrc($entryImg, item.iconURL) || dataTemplateActual;
          }
          if (textKeysToReplace.includes(key)) {
            dataTemplateActual = dataTemplateActual.replaceAll(
              `{|${key}|}`,
              cleanupDoubleQuotes(value) || ""
            );
          } else if (numKeysToReplace.includes(key)) {
            dataTemplateActual = dataTemplateActual.replaceAll(
              `{|${key}|}`,
              Math.round(value || 0)
            );
          }
        });
        $list.append(dataTemplateActual).children().last().removeClass(["bg-light", "bg-dark"]).addClass(`bg-${resIdx % 2 > 0 ? "light" : "dark"}`);
      });
    } else {
      $list.html($emptyList);
      $emptyList.show();
    }
    $list.css("display", "flex");
  }
  async function listFetcher({ elemIdPrefix: elemIdPrefix2, apiDomain: apiDomain2, achievementId: achievementId2 }, { listName, numKeysToReplace, textKeysToReplace }) {
    const elemId = `${elemIdPrefix2}-${listName}`;
    const resList = await fetch(
      `https://${apiDomain2}/api/achievement/${achievementId2}/${listName}`
    );
    const listData = await resList.json();
    listResponseHandler({
      listData,
      listResultsKey: listName,
      elemId,
      numKeysToReplace,
      textKeysToReplace
    });
  }
  var loadGuidesSection = async (elemIdPrefix2, apiDomain2, achievementId2) => {
    await listFetcher(
      { elemIdPrefix: elemIdPrefix2, apiDomain: apiDomain2, achievementId: achievementId2 },
      {
        listName: "guides",
        numKeysToReplace: ["id", "commentsCount", "viewsCount", "likesCount"],
        textKeysToReplace: ["profileId", "name", "description", "author"]
      }
    );
  };

  // components/AchievementPage/AchievementData.js
  function achievementResponseHandler(elemIdPrefix2, res) {
    const elemId = `${elemIdPrefix2}-details`;
    const $ghContainer = $(elemId);
    let dataTemplateActual = $ghContainer.prop("outerHTML");
    console.info(`=== ${elemId} ===`, res);
    const textKeysToReplace = ["id", "name", "description", "gameId", "gameName"];
    const numKeysToReplace = [
      "achievers",
      "completionPercentage",
      "guides",
      "gaPoints"
    ];
    const achievementImg = res.coverURL || res.imageURL || res.gameImageURL;
    if (achievementImg?.length) {
      dataTemplateActual = $ghContainer.css(
        "background-image",
        `linear-gradient(rgba(255,255,255,0),#030922),
          linear-gradient(rgba(70,89,255,.4),rgba(70,89,255,.4)),
          url(${achievementImg})`
      ).prop("outerHTML");
    }
    $(".achievement-main-img", dataTemplateActual).each((idx, elm) => {
      if (res.imageURL?.length) {
        dataTemplateActual = showImageFromSrc($(elm), res.imageURL, elemId) || dataTemplateActual;
      }
    });
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
      } else if (key === "rarity") {
        console.log("value", value);
        dataTemplateActual = showRarityTagAchievement(value, dataTemplateActual);
      }
    });
    $ghContainer.prop("outerHTML", dataTemplateActual);
  }
  async function fetchAchievement(elemIdPrefix2, apiDomain2, achievementId2) {
    const resFetch = await fetch(
      `https://${apiDomain2}/api/achievement/${achievementId2}`
    );
    if (resFetch.status !== 200) {
      return;
    }
    const resData = await resFetch.json();
    if (Object.keys(resData).length > 0 && resData.id) {
      document.title = `${resData.name?.length ? resData.name : resData.id} | ${document.title}`;
      achievementResponseHandler(elemIdPrefix2, resData);
    }
    return resData;
  }

  // webflow/achievement.js
  var apiDomain = document.querySelector("meta[name=domain]")?.content;
  var urlParams = new URLSearchParams(window.location.search);
  var achievementId = urlParams.get("id") || 1044;
  var elemIdPrefix = `#gas-achievement`;
  $(".ga-loader-container").show();
  $("#ga-sections-container").hide();
  $(async () => {
    await auth0Bootstrap();
    await verifyAuthenticatedUserGuideData(
      elemIdPrefix,
      token,
      apiDomain,
      achievementId
    );
    if (await fetchAchievement(elemIdPrefix, apiDomain, achievementId)) {
      await Promise.all([
        await loadGuidesSection(elemIdPrefix, apiDomain, achievementId),
        await loadAchieversSection(elemIdPrefix, apiDomain, achievementId)
      ]);
      $(".ga-loader-container").hide();
      $("#ga-sections-container").show();
      $("#gas-wf-tab-activator").click();
      return;
    }
    window.location.replace("/achievements");
  });
})();
