import { gaDateTime, showImageFromSrc } from '../../utils';

const elemIdPrefix = `#gas-guide`;

function listResponseHandler({ listData, elemId, textKeysToReplace }) {
  console.info(`=== ${elemId} results ===`, listData);
  let dataTemplate = $(elemId).prop('outerHTML');
  const $list = $(`${elemId} .gas-list`);
  const $emptyList = $(`.gas-list-empty`, $list);
  if (listData.count > 0 && listData.results?.length) {
    const $listHeader = $list.children().first();
    const $entryTemplate = $('.gas-list-entry', $list).first();
    $entryTemplate.show();
    dataTemplate = $entryTemplate.prop('outerHTML');
    $list.html($listHeader).append($entryTemplate);
    $entryTemplate.hide();
    listData.results.forEach((item, resIdx) => {
      let dataTemplateActual = dataTemplate;
      Object.entries(item).forEach(([key, value]) => {
        const $entryImg = $(`.gas-list-entry-cover`, dataTemplateActual);
        if ($entryImg.length && item.imageUrl?.length) {
          dataTemplateActual =
            showImageFromSrc($entryImg, item.imageURL) || dataTemplateActual;
        }
        if (textKeysToReplace.includes(key)) {
          dataTemplateActual = dataTemplateActual.replaceAll(
            `{|${key}|}`,
            value || ''
          );
        } else if (key === 'date') {
          const { date, time } = gaDateTime(value);
          dataTemplateActual = dataTemplateActual.replaceAll(
            `{|${key}|}`,
            `${date} at ${time}`
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
  $list.show();
}

async function listFetcher(
  { apiDomain, guideId },
  { listName, textKeysToReplace }
) {
  const elemId = `${elemIdPrefix}-${listName}`;
  const resList = await fetch(
    `https://${apiDomain}/api/guide/${guideId}/${listName}`
  );
  const listData = await resList.json();
  // global replacer
  $(`.gas-guide-${listName}-count`).text(listData.count || '');
  listResponseHandler({
    listData,
    elemId,
    textKeysToReplace,
  });
}

export async function loadComments(apiDomain, guideId) {
  await listFetcher(
    { apiDomain, guideId },
    {
      listName: 'comments',
      numKeysToReplace: [],
      textKeysToReplace: ['profileId', 'author', 'comment'],
    }
  );
}
