import {
  cleanupDoubleQuotes,
  gaDate,
  showImageFromSrc,
  showPlatform,
} from '../../utils';

const apiDomain = document.querySelector('meta[name=domain]')?.content;

let $entryTemplate;
let $listHeader;
let $emptyList;

function listResponseHandler({
  listData,
  elemId,
  numKeysToReplace,
  textKeysToReplace,
}) {
  console.info(`=== ${elemId} results ===`, listData);
  let dataTemplate = $(elemId).prop('outerHTML');
  const $list = $(`${elemId} .gas-list`);
  if (!$entryTemplate) {
    $emptyList = $('.gas-list-empty', $list);
    $listHeader = $list.children().first();
    $entryTemplate = $('.gas-list-entry', $list).first().clone();
    $('.gas-list-entry', $list).first().remove();
  }
  if (listData.length > 0) {
    dataTemplate = $entryTemplate.prop('outerHTML');
    $list.html($listHeader);
    listData.forEach((item, resIdx) => {
      let dataTemplateActual = dataTemplate;
      for (const [key, value] of Object.entries(item)) {
        const $gameImg = $('.gas-list-entry-cover-game', dataTemplateActual);
        if ($gameImg?.length && item.gameIconURL?.length) {
          // TODO: why is WF adding gas-list-entry-cover to this element?
          $gameImg.removeClass('gas-list-entry-cover');
          dataTemplateActual =
            showImageFromSrc($gameImg, item.gameIconURL) || dataTemplateActual;
        }
        const $entryImg = $('.gas-list-entry-cover', dataTemplateActual);
        const imageURL = item.iconURL || item.imageURL;
        if ($entryImg?.length && imageURL?.length) {
          dataTemplateActual =
            showImageFromSrc($entryImg, imageURL) || dataTemplateActual;
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
        } else if (key === 'importedFromPlatform') {
          dataTemplateActual = showPlatform(value, dataTemplateActual);
        } else if (key === 'rarityClass') {
          dataTemplateActual = dataTemplateActual.replaceAll(
            `{|${key}|}`,
            value || ''
          );
          if (value.toLowerCase() !== 'common') {
            const classValue = value.replace(' ', '-')?.toLowerCase();
            dataTemplateActual = $('.gas-rarity-tag', dataTemplateActual)
              .removeClass('gas-rarity-tag')
              .addClass(`gas-rarity-tag-${classValue}`)
              .children('.p1')
              .addClass(classValue)
              .parents('.gas-list-entry')
              .prop('outerHTML');
          }
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
  $list.css('display', 'flex');
}

export async function fetchAchievements(elemId, searchTerm = '') {
  const filterTxt = $('.gas-filters-sw-li.active').first().text();
  const paramsObj = {};
  if (filterTxt !== 'All') {
    paramsObj.startsWith = filterTxt;
  }
  if (searchTerm.length) {
    paramsObj.q = searchTerm;
  }
  const resAchievements = await fetch(
    `https://${apiDomain}/api/achievement/list${
      Object.keys(paramsObj)?.length
        ? `?${new URLSearchParams(paramsObj).toString()}`
        : ''
    }`
  );
  const fetchData = await resAchievements.json();
  $(`${elemId} .gas-list-results-info`).text(
    `${fetchData?.length || 0} result(s)`
  );
  listResponseHandler({
    listData: fetchData,
    elemId,
    numKeysToReplace: [
      'id',
      'gameId',
      'points',
      'playersCount',
      'achieversCount',
      'completion',
      'gameTotalAchievements',
    ],
    textKeysToReplace: [
      'name',
      'gameName',
      'description',
      'updatedAt',
      'platformOriginalAchievementId',
    ],
  });
}
