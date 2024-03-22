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
    textKeysToReplace: [],
    drillDown: {
      key: 'gameVersionData',
      keysToReplace: [
        'completion',
        'platform',
        'totalAchievements',
        'gameIconURL',
        'name',
        'description',
        'gameIconURL',
      ],
    },
  });
  $(`${elemId} .ga-loader-container`).hide();
}
