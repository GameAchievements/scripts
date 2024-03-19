import {
  achievementNameSlicer,
  gaDate,
  listTemplateAppend,
  ratingSVG,
  showImageFromSrc,
  showPlatform,
  showRarityTag,
} from '../../../utils';

const platformsTabNames = ['all', 'playstation', 'xbox', 'steam'];

export function listResponseHandler({
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
    for (const tabName of platformsTabNames) {
      dataTemplate =
        dataTemplate.replaceAll(`{|${tabName}Cnt|}`, tabCounts[tabName]) || '0';
    }
  }
  // replace counts
  $listTabs.prop('outerHTML', dataTemplate);
  for (const tabName of Object.keys(tabCounts)) {
    const $list = $(`${elemId} .gas-list-${tabName}`);
    const $emptyList = $('.gas-list-empty', $list);
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
        for (const [key, value] of Object.entries(item)) {
          const $entryImg = $('.gas-list-entry-cover', dataTemplateActual);
          if ($entryImg && item.iconURL?.length) {
            dataTemplateActual =
              showImageFromSrc($entryImg, item.iconURL) || dataTemplateActual;
          }
          if (elemId.endsWith('achievements') && key === 'name') {
            dataTemplateActual = dataTemplateActual.replaceAll(
              '{|name|}',
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
            dataTemplateActual = showRarityTag(value, dataTemplateActual);
          }
        }

        listTemplateAppend($list, dataTemplateActual, itemIdx);
      });
    } else {
      $list.html($emptyList);
      $emptyList.show();
    }
  }
}
