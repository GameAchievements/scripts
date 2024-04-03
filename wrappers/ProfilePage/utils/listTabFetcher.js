import {
  cleanupDoubleQuotes,
  gaDate,
  isSteamImage,
  rarityClassCalc,
  ratingSVG,
  showImageFromSrc,
  showPlatform,
  toTitleCase,
} from '../../../utils';

function listTabResponseHandler({
  listData,
  elemId,
  numKeysToReplace,
  textKeysToReplace,
  tabCounts,
  tabMatcher,
}) {
  const $listTabs = $(`${elemId} .gas-list-tabs`);
  console.info(`=== ${elemId} results ===`, listData);
  let dataTemplate = $listTabs.prop('outerHTML');
  if (!tabCounts || Object.keys(tabCounts).length < 1) {
    tabMatcher = 'platform';
    tabCounts = {
      allCnt: listData.length,
      playstationCnt: listData.filter(
        (item) => item[tabMatcher].toLowerCase() === 'playstation'
      )?.length,
      xboxCnt: listData.filter(
        (item) => item[tabMatcher].toLowerCase() === 'xbox'
      )?.length,
      steamCnt: listData.filter(
        (item) => item[tabMatcher].toLowerCase() === 'steam'
      )?.length,
    };
  }
  const tabKeysToReplace = Object.keys(tabCounts);

  for (const key of tabKeysToReplace) {
    dataTemplate = dataTemplate.replaceAll(`{|${key}|}`, tabCounts[key]) || '0';
  }
  // replace counts
  $listTabs.prop('outerHTML', dataTemplate);
  for (const key of tabKeysToReplace) {
    const tabName = key.slice(0, key.indexOf('Cnt'));
    const $list = $(`${elemId} .gas-list-${tabName}`);
    const $emptyList = $('.gas-list-empty', $list);
    if (tabCounts[key] > 0) {
      const $listHeader = $list.children().first();
      const $entryTemplate = $('.gas-list-entry', $list).first();
      $entryTemplate.show();
      dataTemplate = $entryTemplate.prop('outerHTML');
      $list.html($listHeader).append($entryTemplate);
      $entryTemplate.hide();
      (tabName === 'all'
        ? listData
        : listData.filter((item) => item[tabMatcher]?.toLowerCase() === tabName)
      ).forEach((item, resIdx) => {
        let dataTemplateActual = dataTemplate;
        for (const [key, value] of Object.entries(item)) {
          const imageURL = item.imageURL || item.iconURL;
          if (imageURL?.length && !isSteamImage(imageURL)) {
            const $entryImg = $('.gas-list-entry-cover', dataTemplateActual);
            if ($entryImg?.length) {
              dataTemplateActual =
                showImageFromSrc($entryImg, imageURL) || dataTemplateActual;
            }
          }
          if (textKeysToReplace.includes(key)) {
            dataTemplateActual = dataTemplateActual.replaceAll(
              `{|${key}|}`,
              (key.endsWith('At')
                ? gaDate(value)
                : cleanupDoubleQuotes(value)) || ''
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
              '.gas-list-entry-rating',
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
            const classValue = rarityClassCalc(value);
            dataTemplateActual = dataTemplateActual.replaceAll(
              `{|${key}|}`,
              toTitleCase(classValue.replace('-', ' '))
            );
            dataTemplateActual = $('.gas-rarity-tag', dataTemplateActual)
              .removeClass('gas-rarity-tag')
              .addClass(`gas-rarity-tag-${classValue}`)
              .children('.p1')
              .addClass(classValue)
              .parents('.gas-list-entry')
              .prop('outerHTML');
          }
        }
        $list
          .append(dataTemplateActual)
          .children()
          .last()
          .removeClass(['bg-light', 'bg-dark'])
          .addClass(`bg-${resIdx % 2 > 0 ? 'light' : 'dark'}`);
      });
    } else {
      $list.html($emptyList);
      $emptyList.show();
    }
  }
}

export async function listTabFetcher(
  { elemIdPrefix, profileId, fetchURLPrefix },
  { listName, numKeysToReplace, textKeysToReplace, tabs = [], tabMatcher }
) {
  const elemId = `${elemIdPrefix}-${listName}`;
  let resFetch;
  if (profileId?.length) {
    const fetchURL = `${fetchURLPrefix}/id/${profileId}/${listName}`;
    resFetch = await fetch(fetchURL);
  } else if (userAuth0Data?.sub?.length) {
    resFetch = await fetch(`${fetchURLPrefix}/my/${listName}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  const listPageData = await resFetch.json();
  const listData = listPageData?.results;
  if (listPageData?.count) {
    let tabCounts;
    if (Array.isArray(tabs)) {
      tabCounts = {};
      for (const tabName of tabs) {
        tabCounts[`${tabName}Cnt`] =
          tabName === 'all'
            ? listData.length
            : listData.filter(
                (item) => item[tabMatcher]?.toLowerCase() === tabName
              )?.length;
      }
    }
    switch (listName) {
      case 'reviews':
        $('.gas-count-reviews').each((idx, revEl) => {
          $(revEl).text(
            $(revEl).text().replace('{|reviewsCnt|}', listData.length)
          );
          if (idx > 0) {
            $(revEl).text(
              $(revEl)
                .text()
                .replace(
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

    listTabResponseHandler({
      listData,
      elemId,
      numKeysToReplace,
      textKeysToReplace,
      tabCounts,
      tabMatcher,
    });
    return;
  }
  const $emptyList = $('.gas-list-empty').first().clone();
  $(`${elemId}`).html($emptyList);
  $emptyList.show();
}
