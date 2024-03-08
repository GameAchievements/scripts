import { gaDateTime, showImageFromSrc } from '../../utils';

function achieversHandler({
  listsData,
  listResultsKey,
  elemId,
  textKeysToReplace,
}) {
  console.info(`=== ${elemId} results ===`, listsData);
  const $list = $(elemId);
  let dataTemplate = $list.prop('outerHTML');
  const $emptyList = $(`.gas-list-empty`, $list);
  const $listHeader = $list.children().first();
  const $entryTemplate = $('.gas-list-entry', $list).first();
  $list.html($listHeader);
  const listDataToRead = listsData[listResultsKey];
  if (listDataToRead?.length > 0) {
    $entryTemplate.show();
    $list.append($entryTemplate);
    dataTemplate = $entryTemplate.prop('outerHTML');
    $entryTemplate.hide();
    listDataToRead.forEach((item, itemIdx) => {
      let dataTemplateActual = dataTemplate;
      Object.entries(item).forEach(([key, value]) => {
        const $entryImg = $(`.gas-list-entry-cover`, dataTemplateActual);
        if ($entryImg?.length && item.iconURL?.length) {
          dataTemplateActual =
            showImageFromSrc($entryImg, item.iconURL) || dataTemplateActual;
        }
        dataTemplateActual = dataTemplateActual.replaceAll(
          `{|idx|}`,
          itemIdx + 1
        );
        if (key === 'unlockedAt') {
          const { date, time } = gaDateTime(value);
          dataTemplateActual = dataTemplateActual.replaceAll(
            `{|unlockedDt|}`,
            date || 'N.A.'
          );
          dataTemplateActual = dataTemplateActual.replaceAll(
            `{|${key}|}`,
            time || 'N.A.'
          );
        } else if (textKeysToReplace.includes(key)) {
          dataTemplateActual = dataTemplateActual.replaceAll(
            `{|${key}|}`,
            value || ''
          );
        }
      });
      $list
        .append(dataTemplateActual)
        .children()
        .last()
        .removeClass(['bg-light', 'bg-dark'])
        .addClass(`bg-${itemIdx % 2 > 0 ? 'light' : 'dark'}`);
    });
  } else {
    $list.append($emptyList);
    $emptyList.show();
  }
  $list.show();
}

async function achieversFetcher(
  { elemIdPrefix, apiDomain, achievementId },
  { listName, type, textKeysToReplace }
) {
  const elemId = `${elemIdPrefix}-${listName}-${
    type === 'last' ? 'latest' : type
  }`;
  const resLists = await fetch(
    `https://${apiDomain}/api/achievement/${achievementId}/${listName}?type=${type}`
  );
  const listsData = await resLists.json();
  achieversHandler({
    listsData,
    listResultsKey: listName,
    elemId,
    textKeysToReplace,
  });
}

export const loadAchieversSection = async (
  elemIdPrefix,
  apiDomain,
  achievementId
) => {
  await achieversFetcher(
    { elemIdPrefix, apiDomain, achievementId },
    {
      listName: 'achievers',
      type: 'first',
      textKeysToReplace: ['name', 'profileId'],
    }
  );
  await achieversFetcher(
    { elemIdPrefix, apiDomain, achievementId },
    {
      listName: 'achievers',
      type: 'last',
      textKeysToReplace: ['name', 'profileId'],
    }
  );
};
