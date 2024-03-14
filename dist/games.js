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

  // utils/checkImageType.js
  var isSteamImage = (imgURL) => imgURL?.includes("steamstatic") || imgURL?.includes("steampowered");

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

  // wrappers/GamesPage/GamesData.js
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
          const imageURL = item.iconURL || item.imageURL;
          if (imageURL?.length && !isSteamImage(imageURL)) {
            const $entryImg = $(".gas-list-entry-cover", dataTemplateActual);
            if ($entryImg?.length) {
              dataTemplateActual = showImageFromSrc($entryImg, imageURL) || dataTemplateActual;
            }
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
          } else if (key === "consoles" && value?.length && !value.includes("PC")) {
            const $tags = $(`.gas-tags-${key}`, dataTemplateActual);
            if ($tags?.length) {
              dataTemplateActual = $tags.html(
                value.map(
                  (tag) => `<div class="console-tag" title="${tag}"><div class="gas-text-overflow">${tag}</div></div>`
                ).join("\n")
              ).parents(".gas-list-entry").prop("outerHTML");
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
  async function fetchGames(elemId, searchTerm2 = "") {
    const filterTxt = $(".gas-filters-sw-li.active").first().text();
    const paramsObj = {};
    if (filterTxt !== "All") {
      paramsObj.startsWith = filterTxt;
    }
    if (searchTerm2.length) {
      paramsObj.q = searchTerm2;
    }
    const resGames = await fetch(
      `https://${apiDomain}/api/game/list${Object.keys(paramsObj)?.length ? `?${new URLSearchParams(paramsObj).toString()}` : ""}`
    );
    const fetchData = await resGames.json();
    $(`${elemId} .gas-list-results-info`).text(
      `${fetchData?.length || 0} result(s)`
    );
    listResponseHandler({
      listData: fetchData,
      elemId,
      numKeysToReplace: ["completion", "achievementsCount"],
      textKeysToReplace: ["id", "name", "description", "updatedAt"]
    });
  }

  // wrappers/GamesPage/FilterByLetter.js
  async function filterByLetter(elemId, event) {
    $(".gas-filters-sw-li", $(elemId)).removeClass("active");
    $(event.target).addClass("active");
    $(".ga-loader-container", $(elemId)).show();
    $(".gas-list,.gas-list-results-info", elemId).hide();
    await fetchGames(elemId);
    $(".gas-list-results-info", elemId).show();
    $(".ga-loader-container").hide();
  }

  // webflow/games.js
  $(async () => {
    await auth0Bootstrap();
    const gamesElemId = "#gas-list-games";
    $(`${gamesElemId} .gas-filters-sw-li`).on(
      "click",
      (ev) => filterByLetter(gamesElemId, ev)
    );
    setupListSearch(gamesElemId, fetchGames);
    await fetchGames(gamesElemId);
    $(".ga-loader-container").hide();
  });
})();
