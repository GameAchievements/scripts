import {
  showPlatform,
  showImageFromSrc,
  gaDate,
  cleanupDoubleQuotes,
  isSteamImage,
} from '../../utils';

const apiDomain = document.querySelector('meta[name=domain]')?.content;
let $entryTemplate, $listHeader, $emptyList;

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
    $emptyList = $(`.gas-list-empty`, $list);
    $listHeader = $list.children().first();
    $entryTemplate = $('.gas-list-entry', $list).first().clone();
    $('.gas-list-entry', $list).first().remove();
  }
  if (listData.length > 0) {
    dataTemplate = $entryTemplate.prop('outerHTML');
    $list.html($listHeader);
    listData.forEach((item, resIdx) => {
      let dataTemplateActual = dataTemplate;
      Object.entries(item).forEach(([key, value]) => {
        const imageURL = item.iconURL || item.imageURL;
        if (imageURL?.length && !isSteamImage(imageURL)) {
          const $entryImg = $(`.gas-list-entry-cover`, dataTemplateActual);
          if ($entryImg?.length) {
            dataTemplateActual =
              showImageFromSrc($entryImg, imageURL) || dataTemplateActual;
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
        } else if (key === 'importedFromPlatform') {
          dataTemplateActual = showPlatform(value, dataTemplateActual);
        } else if (
          key === 'consoles' &&
          value?.length &&
          !value.includes('PC')
        ) {
          const $tags = $(`.gas-tags-${key}`, dataTemplateActual);
          if ($tags?.length) {
            dataTemplateActual = $tags
              .html(
                value
                  .map(
                    (tag) =>
                      `<div class="console-tag" title="${tag}"><div class="gas-text-overflow">${tag}</div></div>`
                  )
                  .join('\n')
              )
              .parents('.gas-list-entry')
              .prop('outerHTML');
          }
        }
      });
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

export async function fetchGames(elemId, searchTerm = '') {
  const filterTxt = $('.gas-filters-sw-li.active').first().text();
  const paramsObj = {};
  if (filterTxt !== 'All') {
    paramsObj.startsWith = filterTxt;
  }
  if (searchTerm.length) {
    paramsObj.q = searchTerm;
  }
  console.log('paramsObj', paramsObj);
  const resGames = await fetch(
    `https://${apiDomain}/api/game/list${
      Object.keys(paramsObj)?.length
        ? `?${new URLSearchParams(paramsObj).toString()}`
        : ''
    }`
  );
  const fetchData = await resGames.json();
  $(`${elemId} .gas-list-results-info`).text(
    (fetchData?.length || 0) + ' result(s)'
  );

  listResponseHandler({
    listData: fetchData,
    elemId,
    numKeysToReplace: ['completion', 'achievementsCount'],
    textKeysToReplace: ['id', 'name', 'description', 'updatedAt'],
  });
}
