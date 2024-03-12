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
  var isXboxEdsImage = (imgURL) => imgURL?.includes("images-eds.xboxlive.com");

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

  // wrappers/HomePage/utils/listResponseHandler.js
  function listResponseHandler({
    listData,
    elemId,
    numKeysToReplace,
    textKeysToReplace,
    drillDown = { key: null, keysToReplace: null }
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
          } else if (key === "importedFromPlatform" || key === "platform" || key === "platforms") {
            dataTemplateActual = showPlatform(value, dataTemplateActual);
          } else if (drillDown.key && key === drillDown.key) {
            drillDown.keysToReplace.forEach((drillReplaceKey) => {
              if (drillReplaceKey === "platform") {
                dataTemplateActual = showPlatform(
                  value[drillReplaceKey],
                  dataTemplateActual
                );
              } else {
                dataTemplateActual = dataTemplateActual.replaceAll(
                  `{|${drillReplaceKey}|}`,
                  Math.round(value[drillReplaceKey] || 0)
                );
              }
            });
          }
        });
        $list.append(dataTemplateActual);
      });
    } else {
      if (listData?.length && !dataTemplate?.length) {
        console.error(`${elemId} template issue (missing a '.gas-' class?)`);
      }
      $(elemId).html($emptyList);
      $emptyList.show();
    }
    $list.css("display", "flex");
  }

  // wrappers/HomePage/AchievementsData.js
  async function fetchAchievements(elemIdPrefix2, apiDomain2) {
    const resFetch = await fetch(
      `https://${apiDomain2}/api/achievement/list/latest`
    );
    let listData = [];
    if (resFetch.ok) {
      const resData = await resFetch.json();
      listData = resData.slice(0, 4);
    }
    const elemId = `${elemIdPrefix2}-list-achievements-latest`;
    listResponseHandler({
      listData,
      elemId,
      numKeysToReplace: ["id"],
      textKeysToReplace: ["name", "description"],
      drillDown: {
        key: "gameVersionData",
        keysToReplace: ["completion", "platform", "totalAchievements"]
      }
    });
    $(`${elemId} .ga-loader-container`).hide();
  }

  // wrappers/HomePage/GamesData.js
  async function fetchGames(type, apiDomain2, elemIdPrefix2) {
    const resFetch = await fetch(`https://${apiDomain2}/api/game/list/${type}`);
    let listData = [];
    if (resFetch.ok) {
      const resData = await resFetch.json();
      listData = resData?.slice(0, 4);
    }
    const elemId = `${elemIdPrefix2}-list-games-${type}`;
    listResponseHandler({
      listData,
      elemId,
      numKeysToReplace: [
        "id",
        "players",
        "achievements",
        "averageCompletion",
        "totalAchievements"
      ],
      textKeysToReplace: [
        "id",
        "name",
        "description",
        "lastPlayed",
        "externalGameId"
      ]
    });
    $(`${elemId} .ga-loader-container`).hide();
  }

  // wrappers/HomePage/GuidesData.js
  async function fetchGuides(elemIdPrefix2, apiDomain2) {
    const resFetch = await fetch(
      `https://${apiDomain2}/api/guide/list?perPage=5&orderBy=createdAt:desc`
    );
    let listData = [];
    if (resFetch.ok) {
      const resData = await resFetch.json();
      listData = resData.results?.slice(0, 4);
    }
    const elemId = `${elemIdPrefix2}-list-guides`;
    listResponseHandler({
      listData,
      elemId,
      numKeysToReplace: ["id", "comments", "likes"],
      textKeysToReplace: ["name", "author", "description", "profileId"]
    });
    $(`${elemId} .ga-loader-container`).hide();
  }

  // wrappers/HomePage/HomeMetrics.js
  async function homeMetricsHandler(apiDomain2) {
    const resFetch = await fetch(`https://${apiDomain2}/api/game/stats`);
    const resData = await resFetch.json();
    const $ghContainer = $("#top-page");
    let dataTemplateActual = $ghContainer.prop("outerHTML");
    console.info(`=== #top-page ===`, resData);
    const numKeysToReplace = [
      "registeredUsers",
      //label: registered gamers
      "gamesTracked",
      //label: games tracked
      "achievementsTracked",
      //label: achievements tracked
      "achievementsUnlocked",
      //label: achievements unlocked
      "forumPosts"
      //label: forum posts
    ];
    Object.entries(resData).forEach(([key, value]) => {
      if (numKeysToReplace.find((el) => el.toLowerCase() === key.toLowerCase())) {
        dataTemplateActual = dataTemplateActual.replaceAll(
          `{|${key}|}`,
          Math.round(value || 0)
        );
      }
    });
    $ghContainer.prop("outerHTML", dataTemplateActual);
  }

  // wrappers/HomePage/LastestThreadsData.js
  var forumDomain = document.querySelector("meta[name=forum-domain]")?.content;
  async function fetchLatestThreads(elemIdPrefix2) {
    const resFetch = await fetch(`https://${forumDomain}/api/recent`);
    let listData = [];
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
    const elemId = `${elemIdPrefix2}-forum-threads`;
    listResponseHandler({
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

  // webflow/home.js
  var apiDomain = document.querySelector("meta[name=domain]")?.content;
  var elemIdPrefix = `#gas-home`;
  $(async () => {
    $(`.ga-loader-container`).show();
    await auth0Bootstrap();
    await Promise.all(
      ["recent", "top"].map(
        async (type) => await fetchGames(type, apiDomain, elemIdPrefix)
      )
    );
    await homeMetricsHandler(apiDomain);
    await fetchGuides(elemIdPrefix, apiDomain);
    await fetchAchievements(elemIdPrefix, apiDomain);
    await fetchLatestThreads(elemIdPrefix);
  });
})();
