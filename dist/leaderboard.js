(() => {
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

  // utils/templateReplacers/setupListSearch.js
  var setupListSearch = (elemId, fetchFn) => {
    $(`${elemId} form.search`).on("submit", async function(evt) {
      evt.preventDefault();
      searchTerm = new URLSearchParams($(this).serialize()).get("query");
      if (searchTerm?.length) {
        $(".ga-loader-container", elemId).show();
        $(".gas-list,.gas-list-results-info", elemId).hide();
        await fetchFn(elemId, searchTerm);
        $(".gas-list-results-info", elemId).show();
        $(".ga-loader-container").hide();
      }
    });
  };

  // webflow/leaderboard.js
  var apiDomain = document.querySelector("meta[name=domain]")?.content;
  var featureName = "leaderboard";
  var $entryTemplate;
  var $listHeader;
  var $emptyList;
  $(".ga-loader-container").show();
  $("#ga-sections-container").hide();
  var paramPlatformId = 0;
  switch (window.location.pathname) {
    case `/playstation-${featureName}`:
      paramPlatformId = 1;
      break;
    case `/xbox-${featureName}`:
      paramPlatformId = 2;
      break;
    case `/steam-${featureName}`:
      paramPlatformId = 3;
      break;
    default:
      break;
  }
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
      $emptyList = $(`.gas-list-empty`, $list);
      $listHeader = $list.children().first();
      $entryTemplate = $(".gas-list-entry", $list).first().clone();
      $(".gas-list-entry", $list).first().remove();
    }
    if (listData?.length) {
      dataTemplate = $entryTemplate.prop("outerHTML");
      $list.html($listHeader);
      listData.forEach((item, resIdx) => {
        let dataTemplateActual = dataTemplate;
        dataTemplateActual = dataTemplateActual.replaceAll(`{|idx|}`, resIdx + 1);
        Object.entries(item).forEach(([key, value]) => {
          if (key === "iconURL") {
            const $profileImg = $(`.gas-list-entry-cover`, dataTemplateActual);
            if ($profileImg?.length && value?.length) {
              dataTemplateActual = showImageFromSrc($profileImg, value) || dataTemplateActual;
            }
          } else if (key === "recentlyPlayed") {
            if (!paramPlatformId && value?.platform?.length) {
              dataTemplateActual = showPlatform(
                value?.platform,
                dataTemplateActual
              );
            }
            const $gameImg = $(`.gas-list-entry-cover-game`, dataTemplateActual);
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
        });
        $list.append(dataTemplateActual).children().last().removeClass(["bg-light", "bg-dark"]).addClass(`bg-${resIdx % 2 > 0 ? "light" : "dark"}`);
      });
    } else {
      $list.html($emptyList);
      $emptyList.show();
    }
    $list.css("display", "flex");
  }
  async function fetchLeaderboard(elemId, searchTerm2 = "") {
    const paramsObj = {};
    if (paramPlatformId) {
      paramsObj.type = paramPlatformId;
    }
    if (searchTerm2.length) {
      paramsObj.q = searchTerm2;
    }
    const resList = await fetch(
      `https://${apiDomain}/api/${featureName}${Object.keys(paramsObj)?.length ? `?${new URLSearchParams(paramsObj).toString()}` : ""}`
    );
    const resData = await resList.json();
    const numKeysToReplace = ["totalAchievements", "gaPoints"];
    switch (paramPlatformId) {
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
  $().ready(async () => {
    await auth0Bootstrap();
    const elemId = `#gas-${featureName}`;
    setupListSearch(elemId, fetchLeaderboard);
    await fetchLeaderboard(elemId);
    $(".ga-loader-container").hide();
    $("#ga-sections-container").show();
  });
})();
