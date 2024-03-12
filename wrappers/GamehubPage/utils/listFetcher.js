import { reviewsBarsHandler } from '../ReviewSection';
import { listResponseHandler } from './listResponseHandler';

export async function listFetcher(
  { elemIdPrefix, gamehubURL },
  { listName, numKeysToReplace, textKeysToReplace, tabs, tabMatcher }
) {
  const elemId = `${elemIdPrefix}-${listName}`;
  const resList = await fetch(`${gamehubURL}/${listName}`);
  const listData = await resList.json();
  if (Array.isArray(listData) || listData.length > 0) {
    let tabCounts;
    if (Array.isArray(tabs)) {
      tabCounts = {};
      tabs.forEach((tabName) => {
        tabCounts[tabName] =
          tabName === 'all'
            ? listData.length
            : listData.filter(
                (item) => item[tabMatcher]?.toLowerCase() === tabName
              )?.length;
      });
    }
    switch (listName) {
      case 'reviews':
        reviewsBarsHandler({ listData, elemId });

        $(`.gas-count-reviews`).each((idx, revEl) => {
          $(revEl).text(
            $(revEl).text().replace('{|reviewsCnt|}', listData.length)
          );
          if (idx > 0) {
            $(revEl).text(
              $(revEl)
                .text()
                .replace(`{|${tabs[idx]}ReviewsCnt|}`, tabCounts[tabs[idx]])
            );
          }
        });
        break;
      case 'guides':
        $(`${elemIdPrefix}-top .gas-count-guides`).text(listData.length);
        break;
      default:
        break;
    }
    listResponseHandler({
      listData,
      elemId,
      numKeysToReplace,
      textKeysToReplace,
      tabCounts,
      tabMatcher,
    });
  }
}
