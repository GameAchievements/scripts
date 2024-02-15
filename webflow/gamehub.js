const apiDomain = document.querySelector('meta[name=domain]')?.content;
const forumDomain = document.querySelector('meta[name=forum-domain]')?.content;
const urlParams = new URLSearchParams(location.search);
const gameId = urlParams.get('id') || 1044;
const gamehubURL = `https://${apiDomain}/api/game/${gameId}`;
const elemIdPrefix = `#gas-gh`;
const versionsDropdownId = `${elemIdPrefix}-versions-dropdown`;
const formMessageDelay = 4000;
const platformsTabNames = ['all', 'playstation', 'xbox', 'steam'];
let gamehubData;
$('.ga-loader-container').show();
$('#ga-sections-container').hide();
//REMOVE OLD ELEMENTS
$('#gas-gh-top-old').remove();
$('#gas-gh-about-old').remove();
$('#achievements-old').remove();

function gamehubResponseHandler(res, elemId) {
  const $ghContainer = $(elemId);
  let dataTemplateActual = $ghContainer.prop('outerHTML');
  console.info(`=== ${elemId} ===`, res);
  const textKeysToReplace = ['name', 'igdbId', 'description', 'releaseDate'];
  const numKeysToReplace = [
    'ownersCount',
    'achievementsCount',
    'recentGamersCount',
    'gaReviewScore',
    'versionsCount',
    'completion',
  ];
  const keysWithArrays = ['genres', 'modes', 'publishers', 'developers'];
  if (elemId.endsWith('top') && (res.coverURL || res.imageURL)?.length) {
    dataTemplateActual = $ghContainer
      .css(
        'background-image',
        `linear-gradient(rgba(255,255,255,0),#030922),
          linear-gradient(rgba(70,89,255,.4),rgba(70,89,255,.4)),
          url(${res.coverURL || res.imageURL})`
      )
      .prop('outerHTML');
  }
  $('.gas-img', dataTemplateActual).each((idx, elm) => {
    if (res.imageURL?.length) {
      dataTemplateActual =
        showImageFromSrc($(elm), res.imageURL, elemId) || dataTemplateActual;
    }
  });
  Object.entries(res).forEach(([key, value]) => {
    if (
      textKeysToReplace.find((el) => el.toLowerCase() === key.toLowerCase())
    ) {
      dataTemplateActual = dataTemplateActual.replaceAll(
        `{|${key}|}`,
        value?.length ? (key.endsWith('Date') ? gaDate(value) : value) : 'N.A.'
      );
    } else if (
      numKeysToReplace.find((el) => el.toLowerCase() === key.toLowerCase())
    ) {
      dataTemplateActual = dataTemplateActual.replaceAll(
        `{|${key}|}`,
        Math.round(value || 0)
      );
    } else if (key === 'platformsInGACount' && elemId.endsWith('top')) {
      dataTemplateActual = showPlatform(
        value?.length ? value : res['importedFromPlatforms'],
        dataTemplateActual,
        elemId
      );
    } else if (keysWithArrays.includes(key)) {
      const $tags = $(`.gas-tags-${key}`, dataTemplateActual);
      if ($tags?.length && value?.length) {
        dataTemplateActual = $tags
          .html(
            value
              .map(
                (tag) =>
                  `<div class="${
                    'igdb'
                    // key === "consoles" ? "gh-console" : "igdb"
                  }-tag" title="${tag}"><div class="gas-text-overflow">${tag}</div></div>`
              )
              .join('\n')
          )
          .parents(elemId)
          .prop('outerHTML');
      }
    }
  });
  $ghContainer.prop('outerHTML', dataTemplateActual);
}

async function fetchGamehub() {
  const resFetch = await fetch(gamehubURL);
  if (!resFetch.ok) {
    location.replace('/games');
    return;
  }
  const resData = await resFetch.json();
  if (Object.keys(resData).length > 0 && resData.id) {
    if (
      resData.versionDetails &&
      resData.versionDetails.defaultVersion !== Number(gameId)
    ) {
      // redirect to the default game version
      location.replace(`/game?id=${resData.versionDetails.defaultVersion}`);
      return;
    }
    document.title = `${resData.name?.length ? resData.name : resData.id} | ${
      document.title
    }`;
    if (resData.igdbId?.length) {
      ['top', 'about'].forEach((elemIdSuf) => {
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
      imageURL: e.user.picture?.toLowerCase().includes('http')
        ? new DOMParser().parseFromString(e.user.picture, 'text/html')
            .documentElement.textContent
        : 'https://uploads-ssl.webflow.com/6455fdc10a7247f51c568c32/64b50ee999d75d5f75a28b08_user%20avatar%20default.svg',
      category_name: e.category.name,
      category_id: e.category.cid,
      views: e.viewcount,
      upvotes: e.upvotes,
      replies: e.postcount,
    }));
  }

  listResponseHandlerHome({
    listData,
    elemId,
    numKeysToReplace: ['replies', 'views', 'upvotes'],
    textKeysToReplace: [
      'title',
      'author_name',
      'category_name',
      'topic_id',
      'category_id',
    ],
  });
  $(`${elemId} .ga-loader-container`).hide();
}

function listResponseHandlerHome({
  listData,
  elemId,
  numKeysToReplace,
  textKeysToReplace,
}) {
  console.info(`=== ${elemId} results ===`, listData);
  let dataTemplate = $(elemId).prop('outerHTML');
  const $list = $(`${elemId} .gas-list`);
  const $emptyList = $(`${elemId} .gas-list-empty`);
  const $entryTemplate = $('.gas-list-entry', $list).first();
  $entryTemplate.show();
  dataTemplate = $entryTemplate.prop('outerHTML');
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
            dataTemplateActual =
              showImageFromSrc($gameImg, item.gameIconURL) ||
              dataTemplateActual;
          }
        }
        if (
          (item.iconURL?.length || item.imageURL?.length) &&
          !isXboxEdsImage(item.imageURL) &&
          !isSteamImage(item.imageURL) &&
          !isSteamImage(item.iconURL)
        ) {
          const $entryImg = $(`.gas-list-entry-cover`, dataTemplateActual);
          if ($entryImg?.length) {
            dataTemplateActual = elemId.includes('list-games')
              ? $entryImg
                  .css('background-image', `url(${item.imageURL})`)
                  .parents('.gas-list-entry')
                  .prop('outerHTML')
              : showImageFromSrc($entryImg, item.iconURL || item.imageURL) ||
                dataTemplateActual;
          }
        }
        if (textKeysToReplace.includes(key)) {
          dataTemplateActual = dataTemplateActual.replaceAll(
            `{|${key}|}`,
            (key.endsWith('At') ? gaDate(value) : cleanupDoubleQuotes(value)) ||
              ''
          );
        } else if (numKeysToReplace.includes(key)) {
          dataTemplateActual = dataTemplateActual.replaceAll(
            `{|${key}|}`,
            Math.round(value || 0)
          );
        } else if (key === 'lastPlayed') {
          dataTemplateActual = dataTemplateActual.replaceAll(
            `{|${key}|}`,
            gaDate(value)
          );
        } else if (key === 'importedFromPlatform' || key === 'platform') {
          dataTemplateActual = showPlatform(value, dataTemplateActual);
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
  $list.css('display', 'flex');
}

function listResponseHandler(props) {
  const {
    listData,
    elemId,
    numKeysToReplace,
    textKeysToReplace,
    tabCounts,
    tabMatcher,
  } = props;

  const $listTabs = $(`${elemId} .gas-list-tabs`);
  console.info(`=== ${elemId} results ===`, listData);
  let dataTemplate = $listTabs.prop('outerHTML');
  if (!tabCounts) {
    tabMatcher = 'platform';
    tabCounts = {
      all: listData.length,
      playstation: listData.filter(
        (item) => item[tabMatcher].toLowerCase() === 'playstation'
      )?.length,
      xbox: listData.filter((item) => item[tabMatcher].toLowerCase() === 'xbox')
        ?.length,
      steam: listData.filter(
        (item) => item[tabMatcher].toLowerCase() === 'steam'
      )?.length,
    };
    platformsTabNames.forEach((tabName) => {
      dataTemplate =
        dataTemplate.replaceAll(`{|${tabName}Cnt|}`, tabCounts[tabName]) || '0';
    });
  }
  // replace counts
  $listTabs.prop('outerHTML', dataTemplate);
  Object.keys(tabCounts).forEach((tabName) => {
    const $list = $(`${elemId} .gas-list-${tabName}`);
    const $emptyList = $(`.gas-list-empty`, $list);
    if (tabCounts[tabName] > 0) {
      const $listHeader = $list.children().first();
      const $entryTemplate = $('.gas-list-entry', $list).first();
      $entryTemplate.show();
      dataTemplate = $entryTemplate.prop('outerHTML');
      $list.html($listHeader).append($entryTemplate);
      $entryTemplate.hide();
      (tabName === 'all'
        ? listData
        : listData.filter((item) => item[tabMatcher]?.toLowerCase() === tabName)
      ).forEach((item, itemIdx) => {
        let dataTemplateActual = dataTemplate;
        Object.entries(item).forEach(([key, value]) => {
          const $entryImg = $(`.gas-list-entry-cover`, dataTemplateActual);
          if ($entryImg && item.iconURL?.length) {
            dataTemplateActual =
              showImageFromSrc($entryImg, item.iconURL) || dataTemplateActual;
          }
          if (elemId.endsWith('achievements') && key === 'name') {
            dataTemplateActual = dataTemplateActual.replaceAll(
              `{|name|}`,
              achievementNameSlicer(value) || 'N.A.'
            );
          } else if (textKeysToReplace.includes(key)) {
            dataTemplateActual = dataTemplateActual.replaceAll(
              `{|${key}|}`,
              (key.endsWith('At') ? gaDate(value) : value) || ''
            );
          } else if (numKeysToReplace.includes(key)) {
            dataTemplateActual = dataTemplateActual.replaceAll(
              `{|${key}|}`,
              Math.round(value || 0)
            );
          } else if (key === 'rating') {
            dataTemplateActual = dataTemplateActual.replaceAll(
              `{|${key}|}`,
              Math.round(value || 0)
            );
            const $rateWrapper = $(
              `.gas-list-entry-rating`,
              dataTemplateActual
            );
            if ($rateWrapper.length) {
              dataTemplateActual = $rateWrapper
                .prepend(ratingSVG(value))
                .parents('.gas-list-entry')
                .prop('outerHTML');
            }
          } else if (key === 'platform') {
            dataTemplateActual = showPlatform(value, dataTemplateActual);
          } else if (key === 'rarity') {
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
  const $barsContainer = $(elemId + '-bars');
  let barItems = [];
  const bars = ['positive', 'mixed', 'negative'];
  if (listData.length) {
    bars.forEach((barName) => {
      barItems = listData.filter(
        (item) => item.classification?.toLowerCase() === barName
      );
      const $bar = $(`.gas-bar-${barName}`, $barsContainer);
      if ($bar.length) {
        // when barItems == 0, 1% width shows a little bit of the bar
        $bar.css('width', `${100 * (barItems.length / listData.length) || 1}%`);
      }
      const $barText = $(`.gas-bar-text-${barName}`, $barsContainer);
      if ($barText.length) {
        $barText.text(barItems?.length);
      }
    });

    const avgRating = Math.round(
      listData
        .map((li) => li.rating)
        .reduce((prevLi, currLi) => prevLi + currLi) / listData.length
    );
    $(`.gas-avg-rate-wrapper`).each((idx, rateEl) => {
      $(rateEl).prepend(ratingSVG(avgRating));
      $('.gas-avg-rate-text', rateEl).text(avgRating);
    });
  } else {
    bars.forEach((barName) => {
      $(`.gas-bar-${barName}`, $barsContainer).css('width', '1%');
    });
    $(`.gas-avg-rate-wrapper`).each((idx, rateEl) => {
      $(rateEl).prepend(ratingSVG(0));
      $('.gas-avg-rate-text', rateEl).text('-');
    });
  }
}

async function listFetcher({
  listName,
  numKeysToReplace,
  textKeysToReplace,
  tabs,
  tabMatcher,
}) {
  const elemId = `${elemIdPrefix}-${listName}`;
  const resList = await fetch(`${gamehubURL}/${listName}`);
  const listData = await resList.json();
  if (Array.isArray(listData) || listData.length > 0) {
    let tabCounts;

    if (Array.isArray(tabs)) {
      tabCounts = {};
      tabs.forEach((tabName) => {
        tabCounts[tabName] =
          tabName === 'all'
            ? listData.length
            : listData.filter(
                (item) => item[tabMatcher]?.toLowerCase() === tabName
              )?.length;
      });
    }
    switch (listName) {
      case 'reviews':
        reviewsBarsHandler({ listData, elemId });

        $(`.gas-count-reviews`).each((idx, revEl) => {
          $(revEl).text(
            $(revEl).text().replace('{|reviewsCnt|}', listData.length)
          );
          if (idx > 0) {
            $(revEl).text(
              $(revEl)
                .text()
                .replace(`{|${tabs[idx]}ReviewsCnt|}`, tabCounts[tabs[idx]])
            );
          }
        });
        break;
      case 'guides':
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
      tabMatcher,
    });
  }
}

function achieversHandler({
  listsData,
  elemId,
  numKeysToReplace,
  textKeysToReplace,
}) {
  console.info(`=== ${elemId} results ===`, listsData);
  const $achieversLists = $(
    `${elemId} .gas-list-first, ${elemId} .gas-list-latest`
  );
  $achieversLists.each((listIdx, listEl) => {
    const $list = $(listEl);
    let dataTemplate = $list.prop('outerHTML');
    const $emptyList = $(`.gas-list-empty`, $list);
    const $listHeader = $list.children().first();
    const $entryTemplate = $('.gas-list-entry', $list).first();
    $list.html($listHeader);
    const listDataToRead =
      listsData[listIdx === 0 ? 'firstAchievers' : 'latestAchievers'];
    if (listDataToRead?.length > 0) {
      $entryTemplate.show();
      $list.append($entryTemplate);
      dataTemplate = $entryTemplate.prop('outerHTML');
      $entryTemplate.hide();
      listDataToRead.forEach((item, itemIdx) => {
        let dataTemplateActual = dataTemplate;
        Object.entries(item).forEach(([key, value]) => {
          const $entryImg = $(`.gas-list-entry-cover`, dataTemplateActual);
          if ($entryImg && item.iconURL?.length) {
            dataTemplateActual =
              showImageFromSrc($entryImg, item.avatar) || dataTemplateActual;
          }
          dataTemplateActual = dataTemplateActual.replaceAll(
            `{|idx|}`,
            itemIdx + 1
          );
          if (key === 'unlockedAt') {
            const { date, time } = gaDateTime(value);
            dataTemplateActual = dataTemplateActual.replaceAll(
              `{|unlockedDt|}`,
              date || 'N.A.'
            );
            dataTemplateActual = dataTemplateActual.replaceAll(
              `{|${key}|}`,
              time || 'N.A.'
            );
          } else if (textKeysToReplace.includes(key)) {
            dataTemplateActual = dataTemplateActual.replaceAll(
              `{|${key}|}`,
              value || ''
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
  textKeysToReplace,
}) {
  const elemId = `${elemIdPrefix}-${listName}`;
  const resLists = await fetch(`${gamehubURL}/${listName}`);
  const listsData = await resLists.json();
  achieversHandler({
    listsData,
    elemId,
    numKeysToReplace,
    textKeysToReplace,
  });
}

async function versionAchievementsFetcher(versionGameId, platformId) {
  const elemId = `${elemIdPrefix}-versions-tab`;
  const $loader = $(`${elemId} .ga-loader-container`);
  const $list = $(`${elemId} .gas-list`);
  const $emptyList = $(`${elemId} .gas-list-empty`);
  $emptyList.hide();
  $list.hide();
  $loader.show();
  const resLists = await fetch(
    `https://${apiDomain}/api/game/${versionGameId}/achievements${
      platformId ? `?platform=${platformId}` : ''
    }`
  );
  const listData = await resLists.json();
  console.info(`=== ${elemId} results ===`, listData);
  const numKeysToReplace = ['id', 'score', 'achieversCount', 'gAPoints'];
  const textKeysToReplace = ['name', 'description', 'updatedAt'];
  const $listHeader = $list.children().first();
  const $entryTemplate = $('.gas-list-entry', $list).first();
  $entryTemplate.show();
  dataTemplate = $entryTemplate.prop('outerHTML');
  $list.html($listHeader).append($entryTemplate);
  if (listData.length > 0) {
    // $entryTemplate.hide();
    listData.forEach((item, itemIdx) => {
      let dataTemplateActual = dataTemplate;
      Object.entries(item).forEach(([key, value]) => {
        const $entryImg = $(`.gas-list-entry-cover`, dataTemplateActual);
        if ($entryImg && item.iconURL?.length) {
          dataTemplateActual =
            showImageFromSrc($entryImg, item.iconURL) || dataTemplateActual;
        }
        if (key === 'name') {
          dataTemplateActual = dataTemplateActual.replaceAll(
            `{|name|}`,
            achievementNameSlicer(value) || 'N.A.'
          );
        } else if (textKeysToReplace.includes(key)) {
          dataTemplateActual = dataTemplateActual.replaceAll(
            `{|${key}|}`,
            (key.endsWith('At') ? gaDate(value) : value) || ''
          );
        } else if (numKeysToReplace.includes(key)) {
          dataTemplateActual = dataTemplateActual.replaceAll(
            `{|${key}|}`,
            Math.round(value || 0)
          );
        } else if (key === 'platform') {
          dataTemplateActual = showPlatform(value, dataTemplateActual);
        } else if (key === 'rarity') {
          dataTemplateActual = showRarityTag(value, dataTemplateActual);
        }
      });
      listTemplateAppend($list, dataTemplateActual, itemIdx);
    });
    $loader.hide();
    $list.css({ display: 'flex', 'flex-direction': 'column' });
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
    'w--open'
  );
  const selectedGameId = Number($optSelected.data('version-id'));
  const platformId = Number(
    platformNameIdMap($optSelected.data('platform')?.toLowerCase()) || 0
  );
  $(`${versionsDropdownId}-text-selected`).text($optSelected.text());
  versionAchievementsFetcher(selectedGameId, platformId);
}

async function versionsFetcher() {
  if (!gamehubData.versionDetails) {
    return;
  }
  const listName = 'versions';
  const elemId = `${elemIdPrefix}-${listName}`;
  const resLists = await fetch(`${gamehubURL}/${listName}`);
  const listData = await resLists.json();
  const numKeysToReplace = ['achievementsCount'];
  const textKeysToReplace = ['gameId', 'externalGameId', 'region'];
  console.info(`=== ${elemId} results ===`, listData);
  let dataTemplate = $(elemId).prop('outerHTML');
  const $list = $(`${elemId} .gas-list`);
  const $headerDesc = $(`${elemId} .heading-description-wrapper`)
    .children()
    .last();
  let $headerDescTemplate = $headerDesc.prop('outerHTML');

  if ($headerDescTemplate) {
    $headerDescTemplate = $headerDescTemplate.replaceAll(
      '{|name|}',
      gamehubData.name
    );
    $headerDesc.prop('outerHTML', $headerDescTemplate);
  }

  if (listData.length) {
    const $listHeader = $list.children().first();
    const $entryTemplate = $('.gas-list-entry', $list).first();
    $entryTemplate.show();
    dataTemplate = $entryTemplate.prop('outerHTML');
    $list.html($listHeader).append($entryTemplate);
    $entryTemplate.hide();

    // versions switching
    const versionOptClass = 'gas-version-option';
    const $selectOptTemplate = $(`${versionsDropdownId}-options`)
      .children()
      .first();
    $selectOptTemplate.addClass(versionOptClass);

    listData.forEach((item, itemIdx) => {
      const $versionOpt = $selectOptTemplate.clone();
      const versionOptionSuffix =
        item.consoles[0] + (item.region ? ` — ${item.region} ` : '');
      $versionOpt
        .data('version-id', item.gameId)
        .data('version-external-id', item.externalGameId)
        .data('platform', item.platform)
        // append console & region to identify version option
        .text(
          (item.name?.length ? `${item.name} | ` : '') + versionOptionSuffix
        );
      $(`${versionsDropdownId}-options`).append($versionOpt);
      let dataTemplateActual = dataTemplate;
      Object.entries(item).forEach(([key, value]) => {
        if (textKeysToReplace.includes(key)) {
          dataTemplateActual = dataTemplateActual.replaceAll(
            `{|${key}|}`,
            value || '?'
          );
        } else if (numKeysToReplace.includes(key)) {
          dataTemplateActual = dataTemplateActual.replaceAll(
            `{|${key}|}`,
            Math.round(value || 0)
          );
        } else if (key === 'name') {
          dataTemplateActual = dataTemplateActual.replaceAll(
            `{|${key}|}`,
            // when the name is empty, identify by console & region
            item.name?.length ? item.name : versionOptionSuffix
          );
        } else if (key === 'platform') {
          dataTemplateActual = showPlatform(value, dataTemplateActual);
        } else if (key === 'consoles') {
          dataTemplateActual = $('.gas-console-tags', dataTemplateActual)
            .html(
              value.map((csl) => {
                const csli = csl.toLowerCase();
                return `<div class="console-${
                  csli.startsWith('ps') ? 'playstation' : csli.slice(0, 4)
                }">${csl}</div>`;
              })
            )
            .parents('.gas-list-entry')
            .prop('outerHTML');
        }
      });
      listTemplateAppend($list, dataTemplateActual, itemIdx);
    });
    $selectOptTemplate.remove();
    $(`.${versionOptClass}`).on('click', versionSelectOption);
  }
  $list.css('display', 'flex');
  $(`${elemId}-tab .gas-list-empty`).show();
  $(`${elemId},${elemId}-tab-btn`).css('display', 'flex');
}

const setupGAReview = () => {
  $(`${elemIdPrefix}-top-ga-score`).prepend(ratingSVG(0));
  $(`${elemIdPrefix}-top-ga-score-text`).text('-');
  if (!gamehubData?.gaReviewURL?.length) {
    // without URL, do not display official review
    return;
  }
  const gaReviewSectionId = `${elemIdPrefix}-official-review`;
  $(gaReviewSectionId).css('display', 'flex');
  $(`${gaReviewSectionId}-placeholder`).hide();
  $(`${gaReviewSectionId}-url`).attr('href', gamehubData.gaReviewURL);
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

const setupReviewForm = async () => {
  const formWrapperId = `${elemIdPrefix}-review-form`;
  const resReview = await fetch(`${gamehubURL}/review`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (resReview.status === 200) {
    $(formWrapperId).remove();
    return;
  }
  const $submitBtn = $(`.submit-button`, formWrapperId);
  $submitBtn.attr('disabled', true);
  const $titleField = $(`[name=title]`, formWrapperId);
  const $contentField = $(`[name=content]`, formWrapperId);
  const $requiredFields = $(`[name][required]`, formWrapperId);
  const submitText = $submitBtn.val();
  const $errEl = $('.gas-form-error', formWrapperId);
  const $errorDiv = $('div', $errEl);
  const txtError = $errEl.text();
  const $successEl = $('.gas-form-success', formWrapperId);
  const $ratingScale = $('.gas-rating-scale', formWrapperId);
  const $rateChosen = $('.gas-rating-selected', formWrapperId);
  ratingScale($ratingScale, $rateChosen);
  let requiredFilled = false;
  const canSubmit = () => {
    if (requiredFilled && Number($rateChosen.data('rate'))) {
      $submitBtn.removeClass('disabled-button').attr('disabled', false);
    }
  };
  $requiredFields.on('focusout keyup', function () {
    $requiredFields.each(function () {
      if (!$(this).val()?.length) {
        requiredFilled = false;
        $(this).prev('label').addClass('field-label-missing');
        $submitBtn.addClass('disabled-button').attr('disabled', true);
      } else {
        requiredFilled = true;
        $(this).prev('label').removeClass('field-label-missing');
      }
    });
    canSubmit();
  });
  $('li', $ratingScale).one('click', function () {
    $ratingScale.parent().prev('label').removeClass('field-label-missing');
    canSubmit();
  });
  $submitBtn.on('click', async (e) => {
    e.preventDefault();
    const rating = Number($rateChosen.data('rate') || 0);
    if (!rating || !$titleField.val()?.length || !$contentField.val().length) {
      $errEl.show();
      $errorDiv.text('Please choose a rating and fill-in required fields');
      setTimeout(() => {
        $errEl.hide();
        $errorDiv.text(txtError);
      }, formMessageDelay);
      return;
    }
    // disable show popup on leave page (site-settings)
    isUserInputActive = false;
    $(`input`, formWrapperId).attr('disabled', true);
    $submitBtn.val($submitBtn.data('wait'));
    const reqData = {
      title: $titleField.val(),
      content: $contentField.val(),
      rating,
    };
    const resFecth = await fetch(`${gamehubURL}/review`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqData),
    });
    const revData = await resFecth.json();
    if (resFecth.status !== 201) {
      $errEl.show();
      $errorDiv.text(revData?.message);
      setTimeout(() => {
        $errEl.hide();
        $errorDiv.text(txtError);
        $(`input`, formWrapperId).attr('disabled', false);
        $submitBtn.val(submitText);
      }, formMessageDelay);
      return;
    }
    $(`form`, formWrapperId).hide();
    $successEl.attr('title', revData?.message).show();
    setTimeout(() => {
      location.reload();
    }, formMessageDelay);
  });
};

async function leaderboardsFetcher(elemId, searchTerm = '') {
  let dataTemplate = $(elemId).prop('outerHTML');
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
    if (searchTerm.length) {
      paramsObj.q = searchTerm;
    }
    const resList = await fetch(
      `https://${apiDomain}/api/leaderboard${
        Object.keys(paramsObj)?.length
          ? `?${new URLSearchParams(paramsObj).toString()}`
          : ''
      }`
    );
    const listData = await resList.json();
    const textKeysToReplace = ['profileId', 'name'];
    const numKeysToReplace = ['totalAchievements', 'gaPoints'];
    switch (paramPlatformId) {
      case 1:
        numKeysToReplace.push('silver', 'bronze', 'gold', 'platinum');
        break;
      case 2:
        numKeysToReplace.push('gamescore');
        break;
      case 3:
        numKeysToReplace.push('games');
        break;
    }
    const $emptyList = $(`.gas-list-empty`, $list);
    if (listData.count > 0 && listData.results?.length) {
      const $listHeader = $list.children().first();
      const $entryTemplate = $('.gas-list-entry', $list).first();
      $entryTemplate.show();
      dataTemplate = $entryTemplate.prop('outerHTML');
      $list.html($listHeader).append($entryTemplate);
      $entryTemplate.hide();
      listData.results.forEach((item, itemIdx) => {
        let dataTemplateActual = dataTemplate;
        dataTemplateActual = dataTemplateActual.replaceAll(
          `{|idx|}`,
          itemIdx + 1
        );
        Object.entries(item).forEach(([key, value]) => {
          if (key === 'iconURL') {
            const $profileImg = $(`.gas-list-entry-cover`, dataTemplateActual);
            if ($profileImg?.length && value?.length) {
              dataTemplateActual =
                showImageFromSrc($profileImg, value) || dataTemplateActual;
            }
          } else if (key === 'recentlyPlayed') {
            if (!paramPlatformId && value?.platform?.length) {
              // only GA leaderboard shows the platform tag
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
              dataTemplateActual =
                showImageFromSrc($gameImg, value.iconURL) || dataTemplateActual;
            }
          } else if (textKeysToReplace.includes(key)) {
            dataTemplateActual = dataTemplateActual.replaceAll(
              `{|${key}|}`,
              value || ''
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
      await listFetcher({
        listName: 'achievements',
        numKeysToReplace: ['id', 'score', 'achieversCount', 'gAPoints'],
        textKeysToReplace: ['name', 'description', 'updatedAt'],
      }),
      await leaderboardsFetcher(`${elemIdPrefix}-leaderboard`),
      await listFetcher({
        listName: 'guides',
        numKeysToReplace: ['id', 'commentsCount', 'viewsCount', 'likesCount'],
        textKeysToReplace: [
          'profileId',
          'name',
          'description',
          'author',
          'updatedAt',
        ],
      }),
      await listFetcher({
        listName: 'reviews',
        numKeysToReplace: ['id', 'likesCount'],
        textKeysToReplace: [
          'profileId',
          'name',
          'content',
          'author',
          'classification',
          'updatedAt',
        ],
        tabs: ['all', 'positive', 'mixed', 'negative'],
        tabMatcher: 'classification',
      }),
      await achieversFetcher({
        listName: 'achievers',
        numKeysToReplace: ['id', 'achievementId'],
        textKeysToReplace: [
          'profileId',
          'achievementName',
          'playerName',
          'name',
        ],
      }),
      await fetchGameLatestThreads(),
    ]);
    $('.ga-loader-container').hide();
    $('#ga-sections-container').show();
    $('#gas-wf-tab-activator').click();
    return;
  }
});
