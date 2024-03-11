import { listResponseHandler } from './utils/listResponseHandler';

export async function fetchGames(type, apiDomain, elemIdPrefix) {
  const resFetch = await fetch(`https://${apiDomain}/api/game/list/${type}`);
  let listData = [];
  if (resFetch.ok) {
    const resData = await resFetch.json();
    listData = resData?.slice(0, 4);
  }
  const elemId = `${elemIdPrefix}-list-games-${type}`;

  listResponseHandler({
    listData,
    elemId,
    numKeysToReplace: [
      'id',
      'players',
      'achievements',
      'averageCompletion',
      'totalAchievements',
    ],
    textKeysToReplace: [
      'id',
      'name',
      'description',
      'lastPlayed',
      'externalGameId',
    ],
  });
  $(`${elemId} .ga-loader-container`).hide();
}
