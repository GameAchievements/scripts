import { showPlatform, showImageFromSrc } from '../../utils';
import { getPlatformId } from './LeaderboardsData';

let $entryTemplate, $listHeader, $emptyList;

export function listResponseHandler({
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
  if (listData?.length) {
    dataTemplate = $entryTemplate.prop('outerHTML');
    $list.html($listHeader);
    listData.forEach((item, resIdx) => {
      let dataTemplateActual = dataTemplate;
      dataTemplateActual = dataTemplateActual.replaceAll(`{|idx|}`, resIdx + 1);
      Object.entries(item).forEach(([key, value]) => {
        if (key === 'iconURL') {
          const $profileImg = $(`.gas-list-entry-cover`, dataTemplateActual);
          if ($profileImg?.length && value?.length) {
            dataTemplateActual =
              showImageFromSrc($profileImg, value) || dataTemplateActual;
          }
        } else if (key === 'recentlyPlayed') {
          if (!getPlatformId() && value?.platform?.length) {
            // only GA leaderboard shows the platform tag
            dataTemplateActual = showPlatform(
              value?.platform,
              dataTemplateActual
            );
          }
          const $gameImg = $(`.gas-list-entry-cover-game`, dataTemplateActual);
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
