import { listResponseHandler } from '../HomePage/utils/listResponseHandler';

export async function loadGuides(elemIdPrefix, apiDomain, profileId) {
  let resFetch;

  if (profileId?.length) {
    resFetch = await fetch(
      `https://${apiDomain}/api/id/${profileId}/guides?perPage=5`
    );
  } else if (userAuth0Data?.sub?.length) {
    resFetch = await fetch(
      `https://${apiDomain}/api/profile/my/guides?perPage=5`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  const listPageData = await resFetch.json();
  const listData = listPageData?.results;

  const elemId = `${elemIdPrefix}-list-guides`;

  listResponseHandler({
    listData,
    elemId,
    numKeysToReplace: ['id', 'commentsCount', 'likesCount', 'viewsCount'],
    textKeysToReplace: [
      'name',
      'author',
      'achievementDescription',
      'profileId',
    ],
  });
  $(`${elemId} .ga-loader-container`).hide();
}
