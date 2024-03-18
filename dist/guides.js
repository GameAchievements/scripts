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

  // utils/achievementNameSlicer.js
  var achievementNameSlicer = (name) => {
    if (!name) {
      return "N.A.";
    }
    const metaDivider = name.lastIndexOf(" | ");
    return metaDivider > 0 ? name.slice(0, metaDivider) : name;
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
    return templateTemp;
  };

  // utils/templateReplacers/showImageFromSrc.js
  var showImageFromSrc = ($img, url, parentSelector = ".gas-list-entry") => $img.removeAttr("srcset").removeAttr("sizes").attr("src", url).parents(parentSelector).prop("outerHTML");

  // utils/templateReplacers/setupListSearch.js
  var setupListSearch = (elemId2, fetchFn, extraParams = {}) => {
    $(`${elemId2} form.search`).on("submit", async function(evt) {
      evt.preventDefault();
      searchTerm = new URLSearchParams($(this).serialize()).get("query");
      if (searchTerm?.length) {
        $(".ga-loader-container", elemId2).show();
        $(".gas-list,.gas-list-results-info", elemId2).hide();
        await fetchFn(elemId2, searchTerm, extraParams);
        $(".gas-list-results-info", elemId2).show();
        $(".ga-loader-container").hide();
      }
    });
  };

  // wrappers/GuidesPage/ListHandler.js
  function listResponseHandler({
    listData,
    elemId: elemId2,
    numKeysToReplace,
    textKeysToReplace
  }) {
    let dataTemplate = $(elemId2).prop("outerHTML");
    const $list = $(`${elemId2} .gas-list`);
    const $emptyList = $(`${elemId2} .gas-list-empty`);
    if (listData?.length) {
      const $entryTemplate = $(".gas-list-entry", $list).first();
      $entryTemplate.show();
      dataTemplate = $entryTemplate.prop("outerHTML");
      $entryTemplate.hide();
      $list.html($entryTemplate);
      listData.forEach((item, resIdx) => {
        let dataTemplateActual = dataTemplate;
        dataTemplateActual = dataTemplateActual.replaceAll("{|idx|}", resIdx + 1);
        for (const [key, value] of Object.entries(item)) {
          if (item.gameIconURL?.length && !isSteamImage(item.gameIconURL)) {
            const $entryImg2 = $(".gas-list-entry-cover-game", dataTemplateActual);
            if ($entryImg2.length) {
              const imgCaption = `For achievement: ${achievementNameSlicer(
                item.achievementName
              )}`;
              dataTemplateActual = showImageFromSrc(
                $entryImg2.attr("alt", imgCaption).attr("title", imgCaption),
                item.gameIconURL
              ) || dataTemplateActual;
            }
          }
          if (item.iconURL?.length && !isSteamImage(item.iconURL)) {
            $entryImg = $(".gas-list-entry-cover", dataTemplateActual);
            if ($entryImg.length && item.iconURL?.length) {
              dataTemplateActual = showImageFromSrc($entryImg, item.iconURL) || dataTemplateActual;
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
          } else if (key === "platform") {
            dataTemplateActual = showPlatform(value, dataTemplateActual);
          }
        }
        $list.append(dataTemplateActual);
      });
    } else {
      $(elemId2).html($emptyList);
      $emptyList.show();
    }
    $list.css("display", "flex");
  }

  // wrappers/GuidesPage/GuidesData.js
  var apiDomain = document.querySelector("meta[name=domain]")?.content;
  async function fetchGuides(elemId2, searchTerm2 = "") {
    const paramsObj = {};
    if (searchTerm2.length) {
      paramsObj.q = searchTerm2;
    }
    const resGuides = await fetch(
      `https://${apiDomain}/api/guide/list${Object.keys(paramsObj)?.length ? `?${new URLSearchParams(paramsObj).toString()}` : ""}`
    );
    const fetchData = await resGuides.json();
    $(`${elemId2} .gas-list-results-info`).text(
      `${fetchData?.count || 0} result(s)`
    );
    listResponseHandler({
      listData: fetchData.results,
      elemId: elemId2,
      numKeysToReplace: ["likes", "comments"],
      textKeysToReplace: [
        "id",
        "name",
        "author",
        "description",
        "achievementId",
        "achievementName",
        "profileId"
      ]
    });
  }

  // webflow/guides.js
  var elemId = "#gas-list-guides";
  $(async () => {
    await auth0Bootstrap();
    setupListSearch(elemId, fetchGuides);
    await fetchGuides(elemId);
    $(".ga-loader-container").hide();
  });
})();
