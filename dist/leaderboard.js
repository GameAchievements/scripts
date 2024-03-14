(() => {
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
    return templateTemp;
  };

  // utils/templateReplacers/showImageFromSrc.js
  var showImageFromSrc = ($img, url, parentSelector = ".gas-list-entry") => $img.removeAttr("srcset").removeAttr("sizes").attr("src", url).parents(parentSelector).prop("outerHTML");

  // utils/templateReplacers/setupListSearch.js
  var setupListSearch = (elemId, fetchFn, extraParams = {}) => {
    $(`${elemId} form.search`).on("submit", async function(evt) {
      evt.preventDefault();
      searchTerm = new URLSearchParams($(this).serialize()).get("query");
      if (searchTerm?.length) {
        $(".ga-loader-container", elemId).show();
        $(".gas-list,.gas-list-results-info", elemId).hide();
        await fetchFn(elemId, searchTerm, extraParams);
        $(".gas-list-results-info", elemId).show();
        $(".ga-loader-container").hide();
      }
    });
  };

  // wrappers/LeaderboardsPage/ListHandler.js
  var $entryTemplate;
  var $listHeader;
  var $emptyList;
  function listResponseHandler({
    listData,
    elemId,
    numKeysToReplace,
    textKeysToReplace
  }) {
    console.info(`=== ${elemId} results ===`, listData);
    let dataTemplate = $(elemId).prop("outerHTML");
    const $list = $(`${elemId} .gas-list`);
    if (!$entryTemplate) {
      $emptyList = $(".gas-list-empty", $list);
      $listHeader = $list.children().first();
      $entryTemplate = $(".gas-list-entry", $list).first().clone();
      $(".gas-list-entry", $list).first().remove();
    }
    if (listData?.length) {
      dataTemplate = $entryTemplate.prop("outerHTML");
      $list.html($listHeader);
      listData.forEach((item, resIdx) => {
        let dataTemplateActual = dataTemplate;
        dataTemplateActual = dataTemplateActual.replaceAll("{|idx|}", resIdx + 1);
        for (const [key, value] of Object.entries(item)) {
          if (key === "iconURL") {
            const $profileImg = $(".gas-list-entry-cover", dataTemplateActual);
            if ($profileImg?.length && value?.length) {
              dataTemplateActual = showImageFromSrc($profileImg, value) || dataTemplateActual;
            }
          } else if (key === "recentlyPlayed") {
            if (!getPlatformId() && value?.platform?.length) {
              dataTemplateActual = showPlatform(
                value?.platform,
                dataTemplateActual
              );
            }
            const $gameImg = $(".gas-list-entry-cover-game", dataTemplateActual);
            if ($gameImg?.length && value?.iconURL?.length) {
              dataTemplateActual = showImageFromSrc($gameImg, value.iconURL) || dataTemplateActual;
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
        }
        $list.append(dataTemplateActual).children().last().removeClass(["bg-light", "bg-dark"]).addClass(`bg-${resIdx % 2 > 0 ? "light" : "dark"}`);
      });
    } else {
      $list.html($emptyList);
      $emptyList.show();
    }
    $list.css("display", "flex");
  }

  // wrappers/LeaderboardsPage/LeaderboardsData.js
  var apiDomain = document.querySelector("meta[name=domain]")?.content;
  var getPlatformId = () => {
    switch (window.location.pathname) {
      case "/playstation-leaderboard":
        return 1;
      case "/xbox-leaderboard":
        return 2;
      case "/steam-leaderboard":
        return 3;
      default:
        return;
    }
  };
  async function fetchLeaderboard(elemId, searchTerm2 = "") {
    const paramsObj = {};
    if (getPlatformId()) {
      paramsObj.type = getPlatformId();
    }
    if (searchTerm2.length) {
      paramsObj.q = searchTerm2;
    }
    const resList = await fetch(
      `https://${apiDomain}/api/leaderboard${Object.keys(paramsObj)?.length ? `?${new URLSearchParams(paramsObj).toString()}` : ""}`
    );
    const resData = await resList.json();
    const numKeysToReplace = ["totalAchievements", "gaPoints"];
    switch (getPlatformId()) {
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
      listData: resData.results,
      elemId,
      numKeysToReplace,
      textKeysToReplace: ["profileId", "name"]
    });
  }

  // webflow/leaderboard.js
  $(".ga-loader-container").show();
  $("#ga-sections-container").hide();
  $(async () => {
    const elemId = "#gas-leaderboard";
    await auth0Bootstrap();
    setupListSearch(elemId, fetchLeaderboard);
    await fetchLeaderboard(elemId);
    $(".ga-loader-container").hide();
    $("#ga-sections-container").show();
  });
})();
