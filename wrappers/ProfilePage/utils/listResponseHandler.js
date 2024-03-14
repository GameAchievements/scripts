import {
  showPlatform,
  showImageFromSrc,
  gaDate,
  cleanupDoubleQuotes,
  isSteamImage,
  isXboxEdsImage,
} from '../../../utils';

export function listResponseHandler({
  listData,
  elemId,
  numKeysToReplace,
  textKeysToReplace,
}) {
  console.info(`=== ${elemId} results ===`, listData);
  let dataTemplate = $(elemId).prop('outerHTML');
  const $list = $(`${elemId} .xbox-achievement-list`);
  const $emptyList = $(`${elemId} .empty-state`);
  const $entryTemplate = $('.gh-row', $list).first();
  $entryTemplate.show();
  dataTemplate = $entryTemplate.prop('outerHTML');
  $entryTemplate.hide();
  if (listData?.length && dataTemplate?.length) {
    $list.html($entryTemplate);
    listData.forEach((item, resIdx) => {
      let dataTemplateActual = dataTemplate;
      dataTemplateActual = dataTemplateActual.replaceAll('{|idx|}', resIdx + 1);
      for (const [key, value] of Object.entries(item)) {
        if (item.gameIconURL?.length && !isSteamImage(item.gameIconURL)) {
          const $gameImg = $('.gas-list-entry-cover-game', dataTemplateActual);
          if ($gameImg?.length) {
            dataTemplateActual =
              showImageFromSrc($gameImg, item.gameIconURL, '.gh-row') ||
              dataTemplateActual;
          }
        }
        if (
          (item.iconURL?.length || item.imageURL?.length) &&
          !isXboxEdsImage(item.imageURL) &&
          !isSteamImage(item.imageURL) &&
          !isSteamImage(item.iconURL)
        ) {
          const $entryImg = $('.gas-list-entry-cover', dataTemplateActual);
          if ($entryImg?.length) {
            dataTemplateActual = elemId.includes('list-games')
              ? $entryImg
                  .css('background-image', `url(${item.imageURL})`)
                  .parents('.gas-list-entry')
                  .prop('outerHTML')
              : showImageFromSrc(
                  $entryImg,
                  item.iconURL || item.imageURL,
                  '.gh-row'
                ) || dataTemplateActual;
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
        } else if (
          key === 'importedFromPlatform' ||
          key === 'platform' ||
          key === 'platforms'
        ) {
          dataTemplateActual = showPlatform(
            value,
            dataTemplateActual,
            '.gh-row'
          );
        }
      }

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
