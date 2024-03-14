import { listResponseHandler } from './utils/listResponseHandler';

export async function loadGames(elemIdPrefix, apiDomain, profileId) {
  let resFetch;
  if (profileId?.length) {
    resFetch = await fetch(
      `https://${apiDomain}/api/id/${profileId}/games?perPage=25`
    );
  } else if (userAuth0Data?.sub?.length) {
    resFetch = await fetch(
      `https://${apiDomain}/api/profile/my/games?perPage=25`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
  const listPageData = await resFetch.json();
  const listData = listPageData?.results;

  const elemId = `${elemIdPrefix}-games-played`;

  listResponseHandler({
    listData,
    elemId,
    numKeysToReplace: [
      'id',
      'gaUserScore',
      'gaTotalScore',
      'userAchievementsCount',
      'achievementsCount',
      'completion',
    ],
    textKeysToReplace: ['name', 'description'],
  });
  $(`${elemId} .ga-loader-container`).hide();
}
