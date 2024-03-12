import {
  showPlatform,
  showImageFromSrc,
  gaDate,
  cleanupDoubleQuotes,
  isSteamImage,
  achievementNameSlicer,
} from '../../utils';

export function listResponseHandler({
  listData,
  elemId,
  numKeysToReplace,
  textKeysToReplace,
}) {
  // console.info(`=== ${elemId} results ===`, listData);
  let dataTemplate = $(elemId).prop('outerHTML');
  const $list = $(`${elemId} .gas-list`);
  const $emptyList = $(`${elemId} .gas-list-empty`);
  if (listData?.length) {
    const $entryTemplate = $('.gas-list-entry', $list).first();
    $entryTemplate.show();
    dataTemplate = $entryTemplate.prop('outerHTML');
    $entryTemplate.hide();
    $list.html($entryTemplate);
    listData.forEach((item, resIdx) => {
      let dataTemplateActual = dataTemplate;
      dataTemplateActual = dataTemplateActual.replaceAll(`{|idx|}`, resIdx + 1);
      Object.entries(item).forEach(([key, value]) => {
        if (item.gameIconURL?.length && !isSteamImage(item.gameIconURL)) {
          let $entryImg = $(`.gas-list-entry-cover-game`, dataTemplateActual);
          if ($entryImg.length) {
            const imgCaption = `For achievement: ${achievementNameSlicer(
              item.achievementName
            )}`;

            dataTemplateActual =
              showImageFromSrc(
                $entryImg.attr('alt', imgCaption).attr('title', imgCaption),
                item.gameIconURL
              ) || dataTemplateActual;
          }
        }
        if (item.iconURL?.length && !isSteamImage(item.iconURL)) {
          $entryImg = $(`.gas-list-entry-cover`, dataTemplateActual);
          if ($entryImg.length && item.iconURL?.length) {
            dataTemplateActual =
              showImageFromSrc($entryImg, item.iconURL) || dataTemplateActual;
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
        } else if (key === 'platform') {
          dataTemplateActual = showPlatform(value, dataTemplateActual);
        }
      });
      $list.append(dataTemplateActual);
    });
  } else {
    $(elemId).html($emptyList);
    $emptyList.show();
  }
  $list.css('display', 'flex');
}
