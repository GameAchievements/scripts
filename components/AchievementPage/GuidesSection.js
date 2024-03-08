import { cleanupDoubleQuotes, showImageFromSrc } from '../../utils';

function listResponseHandler({
  listData,
  listResultsKey,
  elemId,
  numKeysToReplace,
  textKeysToReplace,
}) {
  console.info(`=== ${elemId} results ===`, listData);
  let dataTemplate = $(elemId).prop('outerHTML');
  const $list = $(`${elemId} .gas-list`);
  const $emptyList = $(`.gas-list-empty`, $list);
  if (listData.count > 0 && listData[listResultsKey]?.length) {
    const $listHeader = $list.children().first();
    const $entryTemplate = $('.gas-list-entry', $list).first();
    $entryTemplate.show();
    dataTemplate = $entryTemplate.prop('outerHTML');
    $list.html($listHeader).append($entryTemplate);
    $entryTemplate.hide();
    listData[listResultsKey].forEach((item, resIdx) => {
      let dataTemplateActual = dataTemplate;
      Object.entries(item).forEach(([key, value]) => {
        const $entryImg = $(`.gas-list-entry-cover`, dataTemplateActual);
        if ($entryImg?.length && item.iconURL?.length) {
          dataTemplateActual =
            showImageFromSrc($entryImg, item.iconURL) || dataTemplateActual;
        }
        if (textKeysToReplace.includes(key)) {
          dataTemplateActual = dataTemplateActual.replaceAll(
            `{|${key}|}`,
            cleanupDoubleQuotes(value) || ''
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

async function listFetcher(
  { elemIdPrefix, apiDomain, achievementId },
  { listName, numKeysToReplace, textKeysToReplace }
) {
  const elemId = `${elemIdPrefix}-${listName}`;
  const resList = await fetch(
    `https://${apiDomain}/api/achievement/${achievementId}/${listName}`
  );
  const listData = await resList.json();
  listResponseHandler({
    listData,
    listResultsKey: listName,
    elemId,
    numKeysToReplace,
    textKeysToReplace,
  });
}

export const loadGuidesSection = async (
  elemIdPrefix,
  apiDomain,
  achievementId
) => {
  await listFetcher(
    { elemIdPrefix, apiDomain, achievementId },
    {
      listName: 'guides',
      numKeysToReplace: ['id', 'commentsCount', 'viewsCount', 'likesCount'],
      textKeysToReplace: ['profileId', 'name', 'description', 'author'],
    }
  );
};
