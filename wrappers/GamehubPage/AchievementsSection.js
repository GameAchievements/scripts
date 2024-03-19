import {
  achievementNameSlicer,
  listTemplateAppend,
  showAchievementUnlocked,
  showImageFromSrc,
  showRarityTagAchievement,
  showTrophy,
} from '../../utils';

const elemIdPrefix = '#gas-gh';
const apiDomain = document.querySelector('meta[name=domain]')?.content;

export async function versionAchievementsFetcher(versionGameId, platformId) {
  const elemId = `${elemIdPrefix}-achievements`;
  const $loader = $(`${elemId} .ga-loader-container`);
  $(`${elemId} .achievement-table`).hide();
  const $list = $(
    `${elemId} .${
      platformId === 1 ? 'psn' : platformId === 2 ? 'xbox' : 'xbox' //'steam' //TODO: missing the right table for this
    }-achievement-list`
  );
  const $emptyList = $(`${elemId} .empty-state`);
  $emptyList.hide();
  $list.hide();
  $loader.show();
  const authHeader = { Authorization: `Bearer ${token}` };
  const resLists = await fetch(
    `https://${apiDomain}/api/game/${versionGameId}/achievements${
      platformId ? `?platform=${platformId}` : ''
    }`,
    {
      headers: token ? authHeader : {},
    }
  );
  const listData = await resLists.json();
  console.info(`=== ${elemId} results ===`, listData);

  const textKeysToReplace = ['name', 'description'];
  const numKeysToReplace = ['id', 'score', 'achieversCount', 'gAPoints'];

  const $listParent = $list.parent();
  const $listHeader = $list.children().first();
  const $entryTemplate = $('.gh-row', $list).first();
  $entryTemplate.show();
  const dataTemplate = $entryTemplate.prop('outerHTML');
  $list.html($listHeader).append($entryTemplate);
  if (listData.length > 0) {
    $entryTemplate.hide();
    listData.forEach((item, itemIdx) => {
      let dataTemplateActual = dataTemplate;
      for (const [key, value] of Object.entries(item)) {
        const $entryImg = $('.gas-list-entry-cover', dataTemplateActual);
        if ($entryImg && item.iconURL?.length) {
          dataTemplateActual =
            showImageFromSrc($entryImg, item.iconURL, '.gh-row') ||
            dataTemplateActual;
        }
        if (key === 'name') {
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
        } else if (key === 'rarity') {
          dataTemplateActual = showRarityTagAchievement(
            value,
            dataTemplateActual,
            '.gh-row'
          );
        } else if (key === 'trophyType' && platformId === 1) {
          dataTemplateActual = showTrophy(value, dataTemplateActual);
        } else if (key === 'userProgress' || !item.userProgress) {
          dataTemplateActual = showAchievementUnlocked(
            value,
            dataTemplateActual
          );
        }
      }

      listTemplateAppend(
        $list,
        dataTemplateActual,
        itemIdx,
        item.userProgress?.unlocked
      );
    });
    $loader.hide();
    $listParent.removeClass('hidden');
    $list.css({ display: 'flex', 'flex-direction': 'column' });
    $emptyList.hide();
  } else {
    $loader.hide();
    $list.hide();
    $emptyList.show();
  }
}
