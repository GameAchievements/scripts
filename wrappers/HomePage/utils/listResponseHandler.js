import {
  showPlatform,
  showImageFromSrc,
  gaDate,
  cleanupDoubleQuotes,
  isSteamImage,
  isXboxEdsImage,
  truncateText,
  ratingSVG,
} from '../../../utils';

function handleEntryCoverGame(gameIconURL, dataTemplateActual) {
  let templateAtual = dataTemplateActual;
  const $gameImg = $('.gas-list-entry-cover-game', templateAtual);
  if ($gameImg?.length) {
    templateAtual = showImageFromSrc($gameImg, gameIconURL) || templateAtual;
  }

  return templateAtual;
}

export function listResponseHandler({
  listData,
  elemId,
  numKeysToReplace,
  textKeysToReplace,
  drillDown = { key: null, keysToReplace: null },
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
      dataTemplateActual = dataTemplateActual.replaceAll('{|idx|}', resIdx + 1);
      for (const [key, value] of Object.entries(item)) {
        if (item.gameIconURL?.length && !isSteamImage(item.gameIconURL)) {
          dataTemplateActual = handleEntryCoverGame(
            item.gameIconURL,
            dataTemplateActual
          );
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
        } else if (key === 'content') {
          dataTemplateActual = dataTemplateActual.replaceAll(
            `{|${key}|}`,
            truncateText(value, 160)
          );
        } else if (
          key === 'importedFromPlatform' ||
          key === 'platform' ||
          key === 'platforms'
        ) {
          dataTemplateActual = showPlatform(value, dataTemplateActual);
        } else if (drillDown.key && key === drillDown.key) {
          for (const drillReplaceKey of drillDown.keysToReplace) {
            if (drillReplaceKey === 'platform') {
              dataTemplateActual = showPlatform(
                value[drillReplaceKey],
                dataTemplateActual
              );
            } else if (drillReplaceKey === 'gameIconURL') {
              dataTemplateActual = handleEntryCoverGame(
                value[drillReplaceKey],
                dataTemplateActual
              );
            } else if (typeof value[drillReplaceKey] === 'string') {
              dataTemplateActual = dataTemplateActual.replaceAll(
                `{|${drillReplaceKey}|}`,
                value[drillReplaceKey]
              );
            } else {
              dataTemplateActual = dataTemplateActual.replaceAll(
                `{|${drillReplaceKey}|}`,
                Math.round(value[drillReplaceKey] || 0)
              );
            }
          }
        } else if (key === 'rating') {
          dataTemplateActual = dataTemplateActual.replaceAll(
            `{|${key}|}`,
            Math.round(value || 0)
          );
          const $rateWrapper = $('.gas-list-entry-rating', dataTemplateActual);
          if ($rateWrapper.length) {
            dataTemplateActual = $rateWrapper
              .prepend(ratingSVG(value))
              .parents('.gas-list-entry')
              .prop('outerHTML');
          }
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
