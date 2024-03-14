import { listResponseHandler } from './utils/listResponseHandler';

export async function fetchGuides(elemIdPrefix, apiDomain) {
  const resFetch = await fetch(
    `https://${apiDomain}/api/guide/list?perPage=5&orderBy=createdAt:desc`
  );
  let listData = [];
  if (resFetch.ok) {
    const resData = await resFetch.json();
    listData = resData.results?.slice(0, 4);
  }
  const elemId = `${elemIdPrefix}-list-guides`;
  listResponseHandler({
    listData,
    elemId,
    numKeysToReplace: ['id', 'comments', 'likes'],
    textKeysToReplace: ['name', 'author', 'description', 'profileId'],
  });
  $(`${elemId} .ga-loader-container`).hide();
}
