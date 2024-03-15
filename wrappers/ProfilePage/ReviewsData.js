import { listResponseHandler } from '../HomePage/utils/listResponseHandler';

export async function loadReviews(elemIdPrefix, apiDomain, profileId) {
  let resFetch;

  if (profileId?.length) {
    resFetch = await fetch(
      `https://${apiDomain}/api/id/${profileId}/reviews?perPage=5`
    );
  } else if (userAuth0Data?.sub?.length) {
    resFetch = await fetch(
      `https://${apiDomain}/api/profile/my/reviews?perPage=5`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  const listPageData = await resFetch.json();
  const listData = listPageData?.results;

  const elemId = `${elemIdPrefix}-list-reviews`;

  listResponseHandler({
    listData,
    elemId,
    numKeysToReplace: ['id' /*'rating'*/],
    textKeysToReplace: [
      'name',
      'gameName',
      'achievementDescription',
      'profileId',
      'updatedAt',
    ],
  });
  $(`${elemId} .ga-loader-container`).hide();
}
