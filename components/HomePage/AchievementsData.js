import { listResponseHandler } from './utils/listResponseHandler';

export async function fetchAchievements(elemIdPrefix, apiDomain) {
  const resFetch = await fetch(
    `https://${apiDomain}/api/achievement/list/latest`
  );
  let listData = [];
  if (resFetch.ok) {
    const resData = await resFetch.json();
    listData = resData.slice(0, 4);
  }
  const elemId = `${elemIdPrefix}-list-achievements-latest`;
  listResponseHandler({
    listData,
    elemId,
    numKeysToReplace: ['id'],
    textKeysToReplace: ['name', 'description'],
    drillDown: {
      key: 'gameVersionData',
      keysToReplace: ['completion', 'platform', 'totalAchievements'],
    },
  });
  $(`${elemId} .ga-loader-container`).hide();
}
