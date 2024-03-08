import { gaDateTime, listTemplateAppend, showImageFromSrc } from '../../utils';

const elemIdPrefix = `#gas-gh`;

function achieversHandler({
  listsData,
  elemId,
  numKeysToReplace,
  textKeysToReplace,
}) {
  console.info(`=== ${elemId} results ===`, listsData);
  const $achieversLists = $(
    `${elemId} .gas-list-first, ${elemId} .gas-list-latest`
  );
  $achieversLists.each((listIdx, listEl) => {
    const $list = $(listEl);
    let dataTemplate = $list.prop('outerHTML');
    const $emptyList = $(`.gas-list-empty`, $list);
    const $listHeader = $list.children().first();
    const $entryTemplate = $('.gas-list-entry', $list).first();
    $list.html($listHeader);
    const listDataToRead =
      listsData[listIdx === 0 ? 'firstAchievers' : 'latestAchievers'];
    if (listDataToRead?.length > 0) {
      $entryTemplate.show();
      $list.append($entryTemplate);
      dataTemplate = $entryTemplate.prop('outerHTML');
      $entryTemplate.hide();
      listDataToRead.forEach((item, itemIdx) => {
        let dataTemplateActual = dataTemplate;
        Object.entries(item).forEach(([key, value]) => {
          const $entryImg = $(`.gas-list-entry-cover`, dataTemplateActual);
          if ($entryImg && item.iconURL?.length) {
            dataTemplateActual =
              showImageFromSrc($entryImg, item.avatar) || dataTemplateActual;
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
          } else if (numKeysToReplace.includes(key)) {
            dataTemplateActual = dataTemplateActual.replaceAll(
              `{|${key}|}`,
              Math.round(value || 0)
            );
          }
        });
        listTemplateAppend($list, dataTemplateActual, itemIdx);
      });
    } else {
      $list.append($emptyList);
      $emptyList.show();
    }
  });
}

async function achieversFetcher(
  { gamehubURL },
  { listName, numKeysToReplace, textKeysToReplace }
) {
  const elemId = `${elemIdPrefix}-${listName}`;
  const resLists = await fetch(`${gamehubURL}/${listName}`);
  const listsData = await resLists.json();
  achieversHandler({
    listsData,
    elemId,
    numKeysToReplace,
    textKeysToReplace,
  });
}

//TODO: confirm this is needed in gamehub page
export async function loadAchievers(gamehubURL) {
  await achieversFetcher(
    { gamehubURL },
    {
      listName: 'achievers',
      numKeysToReplace: ['id', 'achievementId'],
      textKeysToReplace: ['profileId', 'achievementName', 'playerName', 'name'],
    }
  );
}
