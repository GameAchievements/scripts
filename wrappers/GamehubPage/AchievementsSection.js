import {
  achievementNameSlicer,
  listTemplateAppend,
  showAchievementUnlocked,
  showImageFromSrc,
  showRarityTagAchievement,
  showTrophy,
} from '../../utils';

import { setupPagination } from '../../utils/pagination/setupPagination';

const elemId = '#gas-gh-achievements';
const apiDomain = document.querySelector('meta[name=domain]')?.content;
let totalPages = 1;
const perPage = 10;

async function versionAchievementsFetcher(
  versionGameId,
  platformId,
  extraParams
) {
  const currentPage =
    $(`${elemId}-pagination .gas-filters-sw-li.active`).text() || 1;
  const $loader = $(`${elemId} .ga-loader-container`);
  $(`${elemId} .achievement-table`).hide();
  const $list = $(
    `${elemId} .${
      platformId === 1 ? 'psn' : platformId === 2 ? 'xbox' : 'xbox' //'steam' //TODO: missing the right table for this
    }-achievement-list`
  );
  const $paginationList = $(`${elemId} .pagination-section`);
  const $emptyList = $(`${elemId} .empty-state`);
  $emptyList.hide();
  $list.hide();
  $loader.show();

  const authHeader = { Authorization: `Bearer ${token}` };
  const urlStr = `https://${apiDomain}/api/game/${versionGameId}/achievements?perPage=${perPage}&offset=${
    currentPage - 1
  }${extraParams ? extraParams : ''}`;

  const resLists = await fetch(urlStr, {
    headers: token ? authHeader : {},
  });
  let listData = [];
  if (resLists.ok) {
    const resAchievements = await resLists.json();
    totalPages = Math.ceil((resAchievements?.count || 1) / perPage);
    listData = resAchievements.results;
  }
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
    $paginationList.removeClass('hidden');
    $list.css({ display: 'flex', 'flex-direction': 'column' });
    $emptyList.hide();
  } else {
    $loader.hide();
    $paginationList.addClass('hidden');
    $list.hide();
    $emptyList.show();
  }
}

export async function loadVersionAchievements(
  versionGameId,
  platformId,
  extraParams = undefined
) {
  const elemIdPagination = `${elemId}-pagination`;
  //run this to reset pagination before load achievements by version
  $('.gas-filters-sw-li.btn-page', $(elemId)).remove();
  $('.btn-ellipsis', $(elemId)).remove();

  await versionAchievementsFetcher(versionGameId, platformId, extraParams);
  setupPagination({
    elemId: elemIdPagination,
    fetchFn: () =>
      versionAchievementsFetcher(versionGameId, platformId, extraParams),
    totalPages,
  });
}
