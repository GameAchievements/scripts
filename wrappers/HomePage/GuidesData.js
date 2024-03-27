import { listResponseHandler } from './utils/listResponseHandler';

export async function fetchGuidesData(elemId, apiDomain) {
  const resFetch = await fetch(
    `https://${apiDomain}/api/guide/list?orderBy=createdAt:desc&perPage=4&offset=0`
  );

  let listData = [];
  if (resFetch.ok) {
    const resData = await resFetch.json();
    listData = resData.results;
  }

  listResponseHandler({
    listData,
    elemId,
    numKeysToReplace: ['id', 'comments', 'likes'],
    textKeysToReplace: ['name', 'author', 'description', 'profileId'],
  });
  $(`${elemId} .ga-loader-container`).hide();
}

export async function loadGuides(elemIdPrefix, apiDomain) {
  const elemId = `${elemIdPrefix}-list-guides`;
  await fetchGuidesData(elemId, apiDomain);
}
