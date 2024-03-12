import {
  listTemplateAppend,
  showImageFromSrc,
  showPlatform,
} from '../../utils';

const apiDomain = document.querySelector('meta[name=domain]')?.content;
const platformsTabNames = ['all', 'playstation', 'xbox', 'steam'];

export async function loadLeaderboards(elemId, searchTerm = '', { gameId }) {
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
    console.info(`=== ${elemId} results ===`, listData);
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
