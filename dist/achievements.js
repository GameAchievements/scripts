(() => {
  // utils/dateTIme.js
  var gaDate = (isoDate) => {
    const pad = (v) => `0${v}`.slice(-2);
    const dateObj = new Date(isoDate);
    return `${dateObj.getFullYear()} . ${pad(dateObj.getMonth() + 1)} . ${pad(
      dateObj.getDate()
    )}`;
  };

  // utils/cleanupDoubleQuotes.js
  var cleanupDoubleQuotes = (content) => content?.length ? content.replace(/"(\w)/g, "\u201C$1").replace(/(\w)"/g, "$1\u201D").replaceAll('"', "'") : content;

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

  // wrappers/AchievementsPage/AchievementsData.js
  var apiDomain = document.querySelector("meta[name=domain]")?.content;
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
    if (listData.length > 0) {
      dataTemplate = $entryTemplate.prop("outerHTML");
      $list.html($listHeader);
      listData.forEach((item, resIdx) => {
        let dataTemplateActual = dataTemplate;
        for (const [key, value] of Object.entries(item)) {
          const $gameImg = $(".gas-list-entry-cover-game", dataTemplateActual);
          if ($gameImg?.length && item.gameIconURL?.length) {
            $gameImg.removeClass("gas-list-entry-cover");
            dataTemplateActual = showImageFromSrc($gameImg, item.gameIconURL) || dataTemplateActual;
          }
          const $entryImg = $(".gas-list-entry-cover", dataTemplateActual);
          const imageURL = item.iconURL || item.imageURL;
          if ($entryImg?.length && imageURL?.length) {
            dataTemplateActual = showImageFromSrc($entryImg, imageURL) || dataTemplateActual;
          }
          if (textKeysToReplace.includes(key)) {
            dataTemplateActual = dataTemplateActual.replaceAll(
              `{|${key}|}`,
              (key.endsWith("At") ? gaDate(value) : cleanupDoubleQuotes(value)) || ""
            );
          } else if (numKeysToReplace.includes(key)) {
            dataTemplateActual = dataTemplateActual.replaceAll(
              `{|${key}|}`,
              Math.round(value || 0)
            );
          } else if (key === "importedFromPlatform") {
            dataTemplateActual = showPlatform(value, dataTemplateActual);
          } else if (key === "rarityClass") {
            dataTemplateActual = dataTemplateActual.replaceAll(
              `{|${key}|}`,
              value || ""
            );
            if (value.toLowerCase() !== "common") {
              const classValue = value.replace(" ", "-")?.toLowerCase();
              dataTemplateActual = $(".gas-rarity-tag", dataTemplateActual).removeClass("gas-rarity-tag").addClass(`gas-rarity-tag-${classValue}`).children(".p1").addClass(classValue).parents(".gas-list-entry").prop("outerHTML");
            }
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
  async function fetchAchievements(elemId, searchTerm2 = "") {
    const filterTxt = $(".gas-filters-sw-li.active").first().text();
    const paramsObj = {};
    if (filterTxt !== "All") {
      paramsObj.startsWith = filterTxt;
    }
    if (searchTerm2.length) {
      paramsObj.q = searchTerm2;
    }
    const resAchievements = await fetch(
      `https://${apiDomain}/api/achievement/list${Object.keys(paramsObj)?.length ? `?${new URLSearchParams(paramsObj).toString()}` : ""}`
    );
    const fetchData = await resAchievements.json();
    $(`${elemId} .gas-list-results-info`).text(
      `${fetchData?.length || 0} result(s)`
    );
    listResponseHandler({
      listData: fetchData,
      elemId,
      numKeysToReplace: [
        "id",
        "gameId",
        "points",
        "playersCount",
        "achieversCount",
        "completion",
        "gameTotalAchievements"
      ],
      textKeysToReplace: [
        "name",
        "gameName",
        "description",
        "updatedAt",
        "platformOriginalAchievementId"
      ]
    });
  }

  // wrappers/AchievementsPage/FilterByLetter.js
  async function filterByLetter(elemId, event) {
    $(".gas-filters-sw-li", $(elemId)).removeClass("active");
    $(event.target).addClass("active");
    $(".ga-loader-container", $(elemId)).show();
    $(".gas-list,.gas-list-results-info", elemId).hide();
    await fetchAchievements(elemId);
    $(".gas-list-results-info", elemId).show();
    $(".ga-loader-container").hide();
  }

  // webflow/achievements.js
  $(async () => {
    await auth0Bootstrap();
    const achievementsElemId = "#gas-list-achievements";
    $(`${achievementsElemId} .gas-filters-sw-li`).on(
      "click",
      (ev) => filterByLetter(achievementsElemId, ev)
    );
    setupListSearch(achievementsElemId, fetchAchievements);
    await fetchAchievements(achievementsElemId);
    $(".ga-loader-container").hide();
  });
})();
