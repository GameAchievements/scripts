(() => {
  // utils/dateTIme.js
  var gaDate = (isoDate) => {
    const pad = (v) => `0${v}`.slice(-2);
    const dateObj = new Date(isoDate);
    return `${dateObj.getFullYear()} . ${pad(dateObj.getMonth() + 1)} . ${pad(
      dateObj.getDate()
    )}`;
  };
  var gaTime = (isoDate) => {
    const pad = (v) => `0${v}`.slice(-2);
    const dateObj = new Date(isoDate);
    return `${pad(dateObj.getHours())}h${pad(dateObj.getMinutes())}`;
  };
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

  // utils/checkImageType.js
  var isSteamImage = (imgURL) => imgURL?.includes("steamstatic") || imgURL?.includes("steampowered");
  var isXboxEdsImage = (imgURL) => imgURL?.includes("images-eds.xboxlive.com");

  // utils/achievementNameSlicer.js
  var achievementNameSlicer = (name) => {
    if (!name) {
      return "N.A.";
    }
    const metaDivider = name.lastIndexOf(" | ");
    return metaDivider > 0 ? name.slice(0, metaDivider) : name;
  };

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

  // utils/templateReplacers/listTemplateAppend.js
  var listTemplateAppend = ($list, dataTemplateActual, itemIdx, unlocked = false) => {
    $list.append(dataTemplateActual).children().last().removeClass(["bg-light", "bg-dark", "locked", "unlocked"]).addClass(`bg-${itemIdx % 2 > 0 ? "light" : "dark"}`).addClass(`${unlocked ? "unlocked" : "locked"}`);
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

  // utils/templateReplacers/showAchievementUnlocked.js
  var showAchievementUnlocked = (userProgress, dataTemplateActual, parent = ".gh-row") => {
    const unlocked = userProgress?.unlocked;
    if (unlocked) {
      dataTemplateActual = dataTemplateActual.replaceAll(
        `{|unlockedAt|}`,
        `${gaTime(userProgress.unlockedAt)}<br />${gaDate(
          userProgress.unlockedAt
        )}`
      );
    }
    dataTemplateActual = $(`.status-wrapper`, dataTemplateActual).children(`:not(.${unlocked ? "unlocked" : "locked"}-status)`).hide().parents(parent).prop("outerHTML");
    return dataTemplateActual;
  };

  // utils/templateReplacers/showTrophy.js
  var showTrophy = (trophyType, dataTemplateActual, parent = ".gh-row") => {
    dataTemplateActual = $(`.trophy-wrapper`, dataTemplateActual).children(`:not(.trophy-${trophyType.toLowerCase()})`).hide().parents(parent).prop("outerHTML");
    return dataTemplateActual;
  };

  // utils/templateReplacers/showImageFromSrc.js
  var showImageFromSrc = ($img, url, parentSelector = ".gas-list-entry") => $img.removeAttr("srcset").removeAttr("sizes").attr("src", url).parents(parentSelector).prop("outerHTML");

  // utils/templateReplacers/showRarityTag.js
  var showRarityTag = (percentageNumber, dataTemplateActual) => {
    const classValue = rarityClassCalc(percentageNumber);
    dataTemplateActual = dataTemplateActual.replaceAll(
      `{|rarity|}`,
      classValue.replace("-", " ")
    );
    dataTemplateActual = $(`.gas-rarity-tag`, dataTemplateActual).removeClass("gas-rarity-tag").addClass(`gas-rarity-tag-${classValue}`).children(".p1").addClass(classValue).parents(".gas-list-entry").prop("outerHTML");
    return dataTemplateActual;
  };

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
  function rateMark() {
    $("svg", this).css("fill", ratingColor(Number($(this).data("rate"))));
    $("p", this).show();
  }
  function rateReset() {
    $("svg", this).css("fill", "#5663BA");
    $("p", this).hide();
  }
  function ratingScale($rateEl, $rateTxtEl) {
    for (let rate = 1; rate < 11; rate++) {
      $rateEl.append(
        `<li data-rate="${rate}" role="button"><p>${rate}</p>${controllerSVG()}</li>`
      );
    }
    $("li", $rateEl).click(function() {
      $(this).siblings().removeClass("rating-active");
      $(this).addClass("rating-active");
      const rating = Number($(this).data("rate"));
      $rateTxtEl.data("rate", rating).text(`${rating}/10`).css("color", ratingColor(rating));
    });
    $("li", $rateEl).on("mouseenter", function() {
      rateMark.apply(this);
      $(this).nextAll().each(rateReset);
      $(this).prevAll().each(rateMark);
    });
    $("li", $rateEl).on("mouseleave", function() {
      const $active = $(".rating-active", $rateEl);
      if (!$active.length) {
        $("li", $rateEl).each(rateReset);
      } else {
        rateMark.apply($active);
        $active.prevAll().each(rateMark);
        $active.nextAll().each(rateReset);
      }
    });
  }
  function ratingSVG(rate) {
    return controllerSVG(`class="bg-review-score" fill="${ratingColor(rate)}"`);
  }

  // webflow/gamehub.js
  var apiDomain = document.querySelector("meta[name=domain]")?.content;
  var forumDomain = document.querySelector("meta[name=forum-domain]")?.content;
  var urlParams = new URLSearchParams(location.search);
  var gameId = urlParams.get("id") || 1044;
  var gamehubURL = `https://${apiDomain}/api/game/${gameId}`;
  var elemIdPrefix = `#gas-gh`;
  var versionsDropdownId = `${elemIdPrefix}-versions-dropdown`;
  var formMessageDelay2 = 4e3;
  var platformsTabNames = ["all", "playstation", "xbox", "steam"];
  var gamehubData;
  $(".ga-loader-container").show();
  $("#ga-sections-container").hide();
  $("#gas-gh-top-old").remove();
  $("#gas-gh-about-old").remove();
  function gamehubResponseHandler(res, elemId) {
    const $ghContainer = $(elemId);
    let dataTemplateActual = $ghContainer.prop("outerHTML");
    console.info(`=== ${elemId} ===`, res);
    const textTopKeysToReplace = ["name", "igdbId", "description"];
    const numTopKeysToReplace = [
      "ownersCount",
      //label: players
      "achievementsCount",
      //label: total achievements
      "gaReviewScore",
      //label: GA score
      "versionsCount",
      //label: game versions
      "completion"
      //label: average completion
    ];
    const textAboutKeysToReplace = ["releaseDate"];
    const numAboutKeysToReplace = [];
    const keysWithArrays = [
      "developers",
      "publishers",
      "franchises",
      "engines",
      "modes",
      "genres",
      "themes",
      "series",
      "supportedLanguages",
      "playerPerspectives"
    ];
    const textKeysToReplace = [
      ...textTopKeysToReplace,
      ...textAboutKeysToReplace
    ];
    const numKeysToReplace = [...numTopKeysToReplace, ...numAboutKeysToReplace];
    if (elemId.endsWith("top") && (res.coverURL || res.imageURL)?.length) {
      dataTemplateActual = $ghContainer.css(
        "background-image",
        `linear-gradient(rgba(255,255,255,0),#030922),
          linear-gradient(rgba(70,89,255,.4),rgba(70,89,255,.4)),
          url(${res.coverURL || res.imageURL})`
      ).prop("outerHTML");
    }
    $(".gas-img", dataTemplateActual).each((idx, elm) => {
      if (res.imageURL?.length) {
        dataTemplateActual = showImageFromSrc($(elm), res.imageURL, elemId) || dataTemplateActual;
      }
    });
    Object.entries(res).forEach(([key, value]) => {
      if (textKeysToReplace.find((el) => el.toLowerCase() === key.toLowerCase())) {
        dataTemplateActual = dataTemplateActual.replaceAll(
          `{|${key}|}`,
          value?.length ? key.endsWith("Date") ? gaDate(value) : value : "N.A."
        );
      } else if (numKeysToReplace.find((el) => el.toLowerCase() === key.toLowerCase())) {
        dataTemplateActual = dataTemplateActual.replaceAll(
          `{|${key}|}`,
          Math.round(value || 0)
        );
      } else if (key === "platformsInGACount" && elemId.endsWith("top")) {
        dataTemplateActual = showPlatform(
          value?.length ? value : res["importedFromPlatforms"],
          dataTemplateActual,
          elemId
        );
      } else if (keysWithArrays.includes(key)) {
        dataTemplateActual = dataTemplateActual.replaceAll(
          `{|${key}|}`,
          value?.length ? value.join(", ") : "N.A."
        );
      }
    });
    $ghContainer.prop("outerHTML", dataTemplateActual);
    const resKeys = Object.keys(res);
    const emptyElems = [
      ...numTopKeysToReplace,
      ...textKeysToReplace,
      ...keysWithArrays
    ].filter((el) => !resKeys.includes(el));
    emptyElems.forEach((el) => {
      $(`div:contains({|${el}|})`).parent(".entry-wrapper").remove();
    });
    if (elemId.endsWith("about") && emptyElems.length > 0) {
      $(".about-game-entry-div").each(function() {
        if ($(this).find(".entry-wrapper").length === 0) {
          $(this).remove();
        }
      });
    }
  }
  async function fetchGamehub() {
    const resFetch = await fetch(gamehubURL);
    if (!resFetch.ok) {
      location.replace("/games");
      return;
    }
    const resData = await resFetch.json();
    if (Object.keys(resData).length > 0 && resData.id) {
      if (resData.versionDetails && resData.versionDetails.defaultVersion !== Number(gameId)) {
        location.replace(`/game?id=${resData.versionDetails.defaultVersion}`);
        return;
      }
      document.title = `${resData.name?.length ? resData.name : resData.id} | ${document.title}`;
      if (resData.igdbId?.length) {
        ["top", "about"].forEach((elemIdSuf) => {
          gamehubResponseHandler(resData, `${elemIdPrefix}-${elemIdSuf}`);
        });
      } else {
        $(
          `${elemIdPrefix}-about,${elemIdPrefix}-igdb-id,[href="${elemIdPrefix}-about"]`
        ).remove();
        gamehubResponseHandler(resData, `${elemIdPrefix}-top`);
      }
    }
    return resData;
  }
  async function fetchGameLatestThreads() {
    let listData = [];
    const elemId = `${elemIdPrefix}-forum-threads`;
    if (gamehubData.forumCategoryID) {
      const resFetch = await fetch(
        `https://${forumDomain}/api/category/${gamehubData.forumCategoryID}`
      );
      if (resFetch.ok) {
        const resData = (await resFetch.json()).topics;
        listData = resData.slice(0, 5);
      }
      listData = listData.map((e) => ({
        id: e.cid,
        title: e.title,
        topic_id: e.tid,
        author_name: e.user.username,
        imageURL: e.user.picture?.toLowerCase().includes("http") ? new DOMParser().parseFromString(e.user.picture, "text/html").documentElement.textContent : "https://uploads-ssl.webflow.com/6455fdc10a7247f51c568c32/64b50ee999d75d5f75a28b08_user%20avatar%20default.svg",
        category_name: e.category.name,
        category_id: e.category.cid,
        views: e.viewcount,
        upvotes: e.upvotes,
        replies: e.postcount
      }));
    }
    listResponseHandlerHome({
      listData,
      elemId,
      numKeysToReplace: ["replies", "views", "upvotes"],
      textKeysToReplace: [
        "title",
        "author_name",
        "category_name",
        "topic_id",
        "category_id"
      ]
    });
    $(`${elemId} .ga-loader-container`).hide();
  }
  function listResponseHandlerHome({
    listData,
    elemId,
    numKeysToReplace,
    textKeysToReplace
  }) {
    console.info(`=== ${elemId} results ===`, listData);
    let dataTemplate = $(elemId).prop("outerHTML");
    const $list = $(`${elemId} .gas-list`);
    const $emptyList = $(`${elemId} .gas-list-empty`);
    const $entryTemplate = $(".gas-list-entry", $list).first();
    $entryTemplate.show();
    dataTemplate = $entryTemplate.prop("outerHTML");
    $entryTemplate.hide();
    if (listData?.length && dataTemplate?.length) {
      $list.html($entryTemplate);
      listData.forEach((item, resIdx) => {
        let dataTemplateActual = dataTemplate;
        dataTemplateActual = dataTemplateActual.replaceAll(`{|idx|}`, resIdx + 1);
        Object.entries(item).forEach(([key, value]) => {
          if (item.gameIconURL?.length && !isSteamImage(item.gameIconURL)) {
            const $gameImg = $(`.gas-list-entry-cover-game`, dataTemplateActual);
            if ($gameImg?.length) {
              dataTemplateActual = showImageFromSrc($gameImg, item.gameIconURL) || dataTemplateActual;
            }
          }
          if ((item.iconURL?.length || item.imageURL?.length) && !isXboxEdsImage(item.imageURL) && !isSteamImage(item.imageURL) && !isSteamImage(item.iconURL)) {
            const $entryImg = $(`.gas-list-entry-cover`, dataTemplateActual);
            if ($entryImg?.length) {
              dataTemplateActual = elemId.includes("list-games") ? $entryImg.css("background-image", `url(${item.imageURL})`).parents(".gas-list-entry").prop("outerHTML") : showImageFromSrc($entryImg, item.iconURL || item.imageURL) || dataTemplateActual;
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
          } else if (key === "lastPlayed") {
            dataTemplateActual = dataTemplateActual.replaceAll(
              `{|${key}|}`,
              gaDate(value)
            );
          } else if (key === "importedFromPlatform" || key === "platform") {
            dataTemplateActual = showPlatform(value, dataTemplateActual);
          }
        });
        $list.append(dataTemplateActual);
      });
    } else {
      if (listData?.length && !dataTemplate?.length) {
        console.error(`${elemId} template issue (missing a '.gas-' class?)`);
      }
      let $emptyElem = $emptyList.children().first();
      let $emptyElemTemplate = $emptyElem.prop("outerHTML").replaceAll("{|name|}", gamehubData.name);
      $emptyElem = $emptyElem.prop("outerHTML", $emptyElemTemplate);
      $(elemId).html($emptyList);
      $emptyList.show();
    }
    $list.css("display", "flex");
  }
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
        all: listData.length,
        playstation: listData.filter(
          (item) => item[tabMatcher].toLowerCase() === "playstation"
        )?.length,
        xbox: listData.filter((item) => item[tabMatcher].toLowerCase() === "xbox")?.length,
        steam: listData.filter(
          (item) => item[tabMatcher].toLowerCase() === "steam"
        )?.length
      };
      platformsTabNames.forEach((tabName) => {
        dataTemplate = dataTemplate.replaceAll(`{|${tabName}Cnt|}`, tabCounts[tabName]) || "0";
      });
    }
    $listTabs.prop("outerHTML", dataTemplate);
    Object.keys(tabCounts).forEach((tabName) => {
      const $list = $(`${elemId} .gas-list-${tabName}`);
      const $emptyList = $(`.gas-list-empty`, $list);
      if (tabCounts[tabName] > 0) {
        const $listHeader = $list.children().first();
        const $entryTemplate = $(".gas-list-entry", $list).first();
        $entryTemplate.show();
        dataTemplate = $entryTemplate.prop("outerHTML");
        $list.html($listHeader).append($entryTemplate);
        $entryTemplate.hide();
        (tabName === "all" ? listData : listData.filter((item) => item[tabMatcher]?.toLowerCase() === tabName)).forEach((item, itemIdx) => {
          let dataTemplateActual = dataTemplate;
          Object.entries(item).forEach(([key, value]) => {
            const $entryImg = $(`.gas-list-entry-cover`, dataTemplateActual);
            if ($entryImg && item.iconURL?.length) {
              dataTemplateActual = showImageFromSrc($entryImg, item.iconURL) || dataTemplateActual;
            }
            if (elemId.endsWith("achievements") && key === "name") {
              dataTemplateActual = dataTemplateActual.replaceAll(
                `{|name|}`,
                achievementNameSlicer(value) || "N.A."
              );
            } else if (textKeysToReplace.includes(key)) {
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
                dataTemplateActual = $rateWrapper.prepend(ratingSVG(value)).parents(".gas-list-entry").prop("outerHTML");
              }
            } else if (key === "platform") {
              dataTemplateActual = showPlatform(value, dataTemplateActual);
            } else if (key === "rarity") {
              dataTemplateActual = showRarityTag(value, dataTemplateActual);
            }
          });
          listTemplateAppend($list, dataTemplateActual, itemIdx);
        });
      } else {
        $list.html($emptyList);
        $emptyList.show();
      }
    });
  }
  function reviewsBarsHandler({ listData, elemId }) {
    const $barsContainer = $(elemId + "-bars");
    let barItems = [];
    const bars = ["positive", "mixed", "negative"];
    if (listData.length) {
      bars.forEach((barName) => {
        barItems = listData.filter(
          (item) => item.classification?.toLowerCase() === barName
        );
        const $bar = $(`.gas-bar-${barName}`, $barsContainer);
        if ($bar.length) {
          $bar.css("width", `${100 * (barItems.length / listData.length) || 1}%`);
        }
        const $barText = $(`.gas-bar-text-${barName}`, $barsContainer);
        if ($barText.length) {
          $barText.text(barItems?.length);
        }
      });
      const avgRating = Math.round(
        listData.map((li) => li.rating).reduce((prevLi, currLi) => prevLi + currLi) / listData.length
      );
      $(`.gas-avg-rate-wrapper`).each((idx, rateEl) => {
        $(rateEl).prepend(ratingSVG(avgRating));
        $(".gas-avg-rate-text", rateEl).text(avgRating);
      });
    } else {
      bars.forEach((barName) => {
        $(`.gas-bar-${barName}`, $barsContainer).css("width", "1%");
      });
      $(`.gas-avg-rate-wrapper`).each((idx, rateEl) => {
        $(rateEl).prepend(ratingSVG(0));
        $(".gas-avg-rate-text", rateEl).text("-");
      });
    }
  }
  async function listFetcher({
    listName,
    numKeysToReplace,
    textKeysToReplace,
    tabs,
    tabMatcher
  }) {
    const elemId = `${elemIdPrefix}-${listName}`;
    const resList = await fetch(`${gamehubURL}/${listName}`);
    const listData = await resList.json();
    if (Array.isArray(listData) || listData.length > 0) {
      let tabCounts;
      if (Array.isArray(tabs)) {
        tabCounts = {};
        tabs.forEach((tabName) => {
          tabCounts[tabName] = tabName === "all" ? listData.length : listData.filter(
            (item) => item[tabMatcher]?.toLowerCase() === tabName
          )?.length;
        });
      }
      switch (listName) {
        case "reviews":
          reviewsBarsHandler({ listData, elemId });
          $(`.gas-count-reviews`).each((idx, revEl) => {
            $(revEl).text(
              $(revEl).text().replace("{|reviewsCnt|}", listData.length)
            );
            if (idx > 0) {
              $(revEl).text(
                $(revEl).text().replace(`{|${tabs[idx]}ReviewsCnt|}`, tabCounts[tabs[idx]])
              );
            }
          });
          break;
        case "guides":
          $(`${elemIdPrefix}-top .gas-count-guides`).text(listData.length);
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
    }
  }
  function achieversHandler({
    listsData,
    elemId,
    numKeysToReplace,
    textKeysToReplace
  }) {
    console.info(`=== ${elemId} results ===`, listsData);
    const $achieversLists = $(
      `${elemId} .gas-list-first, ${elemId} .gas-list-latest`
    );
    $achieversLists.each((listIdx, listEl) => {
      const $list = $(listEl);
      let dataTemplate = $list.prop("outerHTML");
      const $emptyList = $(`.gas-list-empty`, $list);
      const $listHeader = $list.children().first();
      const $entryTemplate = $(".gas-list-entry", $list).first();
      $list.html($listHeader);
      const listDataToRead = listsData[listIdx === 0 ? "firstAchievers" : "latestAchievers"];
      if (listDataToRead?.length > 0) {
        $entryTemplate.show();
        $list.append($entryTemplate);
        dataTemplate = $entryTemplate.prop("outerHTML");
        $entryTemplate.hide();
        listDataToRead.forEach((item, itemIdx) => {
          let dataTemplateActual = dataTemplate;
          Object.entries(item).forEach(([key, value]) => {
            const $entryImg = $(`.gas-list-entry-cover`, dataTemplateActual);
            if ($entryImg && item.iconURL?.length) {
              dataTemplateActual = showImageFromSrc($entryImg, item.avatar) || dataTemplateActual;
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
            } else if (numKeysToReplace.includes(key)) {
              dataTemplateActual = dataTemplateActual.replaceAll(
                `{|${key}|}`,
                Math.round(value || 0)
              );
            }
          });
          listTemplateAppend($list, dataTemplateActual, itemIdx);
        });
      } else {
        $list.append($emptyList);
        $emptyList.show();
      }
    });
  }
  async function achieversFetcher({
    listName,
    numKeysToReplace,
    textKeysToReplace
  }) {
    const elemId = `${elemIdPrefix}-${listName}`;
    const resLists = await fetch(`${gamehubURL}/${listName}`);
    const listsData = await resLists.json();
    achieversHandler({
      listsData,
      elemId,
      numKeysToReplace,
      textKeysToReplace
    });
  }
  async function versionAchievementsFetcher(versionGameId, platformId) {
    const elemId = `${elemIdPrefix}-achievements`;
    const $loader = $(`${elemId} .ga-loader-container`);
    const $list = $(
      `${elemId} .${platformId === 1 ? "psn" : platformId === 2 ? "xbox" : "xbox"}-achievement-list`
    );
    const $emptyList = $(`${elemId} .empty-state`);
    $emptyList.hide();
    $list.hide();
    $loader.show();
    const authHeader = { Authorization: `Bearer ${token}` };
    const resLists = await fetch(
      `https://${apiDomain}/api/game/${versionGameId}/achievements${platformId ? `?platform=${platformId}` : ""}`,
      {
        headers: token ? authHeader : {}
      }
    );
    const listData = await resLists.json();
    console.info(`=== ${elemId} results ===`, listData);
    const textKeysToReplace = ["name", "description"];
    const numKeysToReplace = ["id", "score", "achieversCount", "gAPoints"];
    const $listParent = $list.parent();
    const $listHeader = $list.children().first();
    const $entryTemplate = $(".gh-row", $list).first();
    $entryTemplate.show();
    let dataTemplate = $entryTemplate.prop("outerHTML");
    $list.html($listHeader).append($entryTemplate);
    if (listData.length > 0) {
      $entryTemplate.hide();
      listData.forEach((item, itemIdx) => {
        let dataTemplateActual = dataTemplate;
        Object.entries(item).forEach(([key, value]) => {
          const $entryImg = $(`.gas-list-entry-cover`, dataTemplateActual);
          if ($entryImg && item.iconURL?.length) {
            dataTemplateActual = showImageFromSrc($entryImg, item.iconURL, ".gh-row") || dataTemplateActual;
          }
          if (key === "name") {
            dataTemplateActual = dataTemplateActual.replaceAll(
              `{|name|}`,
              achievementNameSlicer(value) || "N.A."
            );
          } else if (textKeysToReplace.includes(key)) {
            dataTemplateActual = dataTemplateActual.replaceAll(
              `{|${key}|}`,
              (key.endsWith("At") ? gaDate(value) : value) || ""
            );
          } else if (numKeysToReplace.includes(key)) {
            dataTemplateActual = dataTemplateActual.replaceAll(
              `{|${key}|}`,
              Math.round(value || 0)
            );
          } else if (key === "rarity") {
            dataTemplateActual = showRarityTagAchievement(
              value,
              dataTemplateActual,
              ".gh-row"
            );
          } else if (key === "trophyType" && platformId === 1) {
            dataTemplateActual = showTrophy(value, dataTemplateActual);
          } else if (key === "userProgress") {
            dataTemplateActual = showAchievementUnlocked(
              value,
              dataTemplateActual
            );
          }
        });
        listTemplateAppend(
          $list,
          dataTemplateActual,
          itemIdx,
          item.userProgress?.unlocked
        );
      });
      $loader.hide();
      $listParent.removeClass("hidden");
      $list.css({ display: "flex", "flex-direction": "column" });
      $emptyList.hide();
    } else {
      $loader.hide();
      $list.hide();
      $emptyList.show();
    }
  }
  async function versionSelectOption(e) {
    const $optSelected = $(e.target);
    $(`${versionsDropdownId}-options,${versionsDropdownId}-toggle`).removeClass(
      "w--open"
    );
    const selectedGameId = Number($optSelected.data("version-id"));
    const platformId = Number(
      platformNameIdMap($optSelected.data("platform")?.toLowerCase()) || 0
    );
    $(`${versionsDropdownId}-text-selected`).text($optSelected.text());
    versionAchievementsFetcher(selectedGameId, platformId);
  }
  async function versionsFetcher() {
    const listName = "versions";
    const elemId = `${elemIdPrefix}-${listName}`;
    if (!gamehubData.versionDetails) {
      const platformId = Number(
        gamehubData.platforms.length >= 1 ? platformNameIdMap(gamehubData.platforms[0]) : 0
      );
      $(versionsDropdownId).remove();
      return versionAchievementsFetcher(gamehubData.id, platformId);
    }
    const resLists = await fetch(`${gamehubURL}/${listName}`);
    const listData = await resLists.json();
    const numKeysToReplace = ["achievementsCount"];
    const textKeysToReplace = ["gameId", "externalGameId", "region"];
    console.info(`=== ${elemId} results ===`, listData);
    let dataTemplate = $(elemId).prop("outerHTML");
    const $list = $(`${elemId} .gas-list`);
    const $headerDesc = $(`${elemId} .heading-description-wrapper`).children().last();
    let $headerDescTemplate = $headerDesc.prop("outerHTML");
    if ($headerDescTemplate) {
      $headerDescTemplate = $headerDescTemplate.replaceAll(
        "{|name|}",
        gamehubData.name
      );
      $headerDesc.prop("outerHTML", $headerDescTemplate);
    }
    if (listData.length) {
      const $listHeader = $list.children().first();
      const $entryTemplate = $(".gas-list-entry", $list).first();
      $entryTemplate.show();
      dataTemplate = $entryTemplate.prop("outerHTML");
      $list.html($listHeader).append($entryTemplate);
      $entryTemplate.hide();
      const versionOptClass = "gas-version-option";
      const $selectOptTemplate = $(`${versionsDropdownId}-options`).children().first();
      $selectOptTemplate.addClass(versionOptClass);
      listData.forEach((item, itemIdx) => {
        const $versionOpt = $selectOptTemplate.clone();
        const versionOptionSuffix = item.consoles[0] + (item.region ? ` \u2014 ${item.region} ` : "");
        $versionOpt.data("version-id", item.gameId).data("version-external-id", item.externalGameId).data("platform", item.platform).text(
          (item.name?.length ? `${item.name} | ` : "") + versionOptionSuffix
        );
        $(`${versionsDropdownId}-options`).append($versionOpt);
        let dataTemplateActual = dataTemplate;
        Object.entries(item).forEach(([key, value]) => {
          if (textKeysToReplace.includes(key)) {
            dataTemplateActual = dataTemplateActual.replaceAll(
              `{|${key}|}`,
              value || "?"
            );
          } else if (numKeysToReplace.includes(key)) {
            dataTemplateActual = dataTemplateActual.replaceAll(
              `{|${key}|}`,
              Math.round(value || 0)
            );
          } else if (key === "name") {
            dataTemplateActual = dataTemplateActual.replaceAll(
              `{|${key}|}`,
              // when the name is empty, identify by console & region
              item.name?.length ? item.name : versionOptionSuffix
            );
          } else if (key === "platform") {
            dataTemplateActual = showPlatform(value, dataTemplateActual);
          } else if (key === "consoles") {
            dataTemplateActual = $(".gas-console-tags", dataTemplateActual).html(
              value.map((csl) => {
                const csli = csl.toLowerCase();
                return `<div class="console-${csli.startsWith("ps") ? "playstation" : csli.slice(0, 4)}">${csl}</div>`;
              })
            ).parents(".gas-list-entry").prop("outerHTML");
          }
        });
        listTemplateAppend($list, dataTemplateActual, itemIdx);
      });
      $selectOptTemplate.remove();
      $(`.${versionOptClass}`).on("click", versionSelectOption);
    }
    $list.css("display", "flex");
    $(`${elemId}-tab .gas-list-empty`).show();
    $(`${elemId},${elemId}-tab-btn`).css("display", "flex");
  }
  var setupGAReview = () => {
    $("#official-review-game-title").text(gamehubData.name);
    $(`${elemIdPrefix}-top-ga-score`).prepend(ratingSVG(0));
    $(`${elemIdPrefix}-top-ga-score-text`).text("-");
    if (!gamehubData?.gaReviewURL?.length) {
      return;
    }
    const gaReviewSectionId = `${elemIdPrefix}-official-review`;
    $(gaReviewSectionId).css("display", "flex");
    $(`${gaReviewSectionId}-placeholder`).hide();
    $(`${gaReviewSectionId}-url`).attr("href", gamehubData.gaReviewURL);
    if (gamehubData?.gaReviewSummary?.length) {
      $(`${gaReviewSectionId}-summary`).text(gamehubData.gaReviewSummary);
    }
    if (gamehubData?.gaReviewScore) {
      const roundedRate = Math.round(gamehubData.gaReviewScore);
      const rateEl = ratingSVG(roundedRate);
      $(`${gaReviewSectionId}-score-text`).text(roundedRate);
      $(`${gaReviewSectionId}-score-bg`).replaceWith(rateEl);
      $(`${elemIdPrefix}-top-ga-score .bg-review-score`).replaceWith(rateEl);
      $(`${elemIdPrefix}-top-ga-score-text`).text(roundedRate);
    } else {
      $(`${gaReviewSectionId}-score`).parent().remove();
    }
  };
  var setupReviewForm = async () => {
    const formWrapperId = `${elemIdPrefix}-review-form`;
    const resReview = await fetch(`${gamehubURL}/review`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (resReview.status === 200) {
      $(formWrapperId).remove();
      return;
    }
    const $submitBtn = $(`.submit-button`, formWrapperId);
    $submitBtn.attr("disabled", true);
    const $titleField = $(`[name=title]`, formWrapperId);
    const $contentField = $(`[name=content]`, formWrapperId);
    const $requiredFields = $(`[name][required]`, formWrapperId);
    const submitText = $submitBtn.val();
    const $errEl = $(".gas-form-error", formWrapperId);
    const $errorDiv = $("div", $errEl);
    const txtError = $errEl.text();
    const $successEl = $(".gas-form-success", formWrapperId);
    const $ratingScale = $(".gas-rating-scale", formWrapperId);
    const $rateChosen = $(".gas-rating-selected", formWrapperId);
    ratingScale($ratingScale, $rateChosen);
    let requiredFilled = false;
    const canSubmit = () => {
      if (requiredFilled && Number($rateChosen.data("rate"))) {
        $submitBtn.removeClass("disabled-button").attr("disabled", false);
      }
    };
    $requiredFields.on("focusout keyup", function() {
      $requiredFields.each(function() {
        if (!$(this).val()?.length) {
          requiredFilled = false;
          $(this).prev("label").addClass("field-label-missing");
          $submitBtn.addClass("disabled-button").attr("disabled", true);
        } else {
          requiredFilled = true;
          $(this).prev("label").removeClass("field-label-missing");
        }
      });
      canSubmit();
    });
    $("li", $ratingScale).one("click", function() {
      $ratingScale.parent().prev("label").removeClass("field-label-missing");
      canSubmit();
    });
    $submitBtn.on("click", async (e) => {
      e.preventDefault();
      const rating = Number($rateChosen.data("rate") || 0);
      if (!rating || !$titleField.val()?.length || !$contentField.val().length) {
        $errEl.show();
        $errorDiv.text("Please choose a rating and fill-in required fields");
        setTimeout(() => {
          $errEl.hide();
          $errorDiv.text(txtError);
        }, formMessageDelay2);
        return;
      }
      isUserInputActive = false;
      $(`input`, formWrapperId).attr("disabled", true);
      $submitBtn.val($submitBtn.data("wait"));
      const reqData = {
        title: $titleField.val(),
        content: $contentField.val(),
        rating
      };
      const resFecth = await fetch(`${gamehubURL}/review`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(reqData)
      });
      const revData = await resFecth.json();
      if (resFecth.status !== 201) {
        $errEl.show();
        $errorDiv.text(revData?.message);
        setTimeout(() => {
          $errEl.hide();
          $errorDiv.text(txtError);
          $(`input`, formWrapperId).attr("disabled", false);
          $submitBtn.val(submitText);
        }, formMessageDelay2);
        return;
      }
      $(`form`, formWrapperId).hide();
      $successEl.attr("title", revData?.message).show();
      setTimeout(() => {
        location.reload();
      }, formMessageDelay2);
    });
  };
  async function leaderboardsFetcher(elemId, searchTerm2 = "") {
    let dataTemplate = $(elemId).prop("outerHTML");
    platformsTabNames.forEach(async (tabName) => {
      const $list = $(`${elemId} .gas-list-${tabName}`);
      let paramPlatformId = 0;
      switch (tabName) {
        case `playstation`:
          paramPlatformId = 1;
          break;
        case `xbox`:
          paramPlatformId = 2;
          break;
        case `steam`:
          paramPlatformId = 3;
          break;
        default:
          break;
      }
      const paramsObj = { gameId };
      if (paramPlatformId) {
        paramsObj.type = paramPlatformId;
      }
      if (searchTerm2.length) {
        paramsObj.q = searchTerm2;
      }
      const resList = await fetch(
        `https://${apiDomain}/api/leaderboard${Object.keys(paramsObj)?.length ? `?${new URLSearchParams(paramsObj).toString()}` : ""}`
      );
      const listData = await resList.json();
      const textKeysToReplace = ["profileId", "name"];
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
      const $emptyList = $(`.gas-list-empty`, $list);
      if (listData.count > 0 && listData.results?.length) {
        const $listHeader = $list.children().first();
        const $entryTemplate = $(".gas-list-entry", $list).first();
        $entryTemplate.show();
        dataTemplate = $entryTemplate.prop("outerHTML");
        $list.html($listHeader).append($entryTemplate);
        $entryTemplate.hide();
        listData.results.forEach((item, itemIdx) => {
          let dataTemplateActual = dataTemplate;
          dataTemplateActual = dataTemplateActual.replaceAll(
            `{|idx|}`,
            itemIdx + 1
          );
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
              const $gameImg = $(
                `.gas-list-entry-cover-game`,
                dataTemplateActual
              );
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
          listTemplateAppend($list, dataTemplateActual, itemIdx);
        });
      } else {
        $list.html($emptyList);
        $emptyList.show();
      }
    });
  }
  $().ready(async () => {
    await auth0Bootstrap();
    gamehubData = await fetchGamehub();
    if (gamehubData) {
      setupGAReview();
      setupReviewForm();
      setupListSearch(`${elemIdPrefix}-leaderboard`, leaderboardsFetcher);
      await Promise.all([
        await versionsFetcher(),
        await leaderboardsFetcher(`${elemIdPrefix}-leaderboard`),
        await listFetcher({
          listName: "guides",
          numKeysToReplace: ["id", "commentsCount", "viewsCount", "likesCount"],
          textKeysToReplace: [
            "profileId",
            "name",
            "description",
            "author",
            "updatedAt"
          ]
        }),
        await listFetcher({
          listName: "reviews",
          numKeysToReplace: ["id", "likesCount"],
          textKeysToReplace: [
            "profileId",
            "name",
            "content",
            "author",
            "classification",
            "updatedAt"
          ],
          tabs: ["all", "positive", "mixed", "negative"],
          tabMatcher: "classification"
        }),
        await achieversFetcher({
          listName: "achievers",
          numKeysToReplace: ["id", "achievementId"],
          textKeysToReplace: [
            "profileId",
            "achievementName",
            "playerName",
            "name"
          ]
        }),
        await fetchGameLatestThreads()
      ]);
      $(".ga-loader-container").hide();
      $("#ga-sections-container").show();
      $("#gas-wf-tab-activator").click();
      return;
    }
  });
})();
