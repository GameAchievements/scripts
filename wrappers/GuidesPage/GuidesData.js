import { listResponseHandler } from './ListHandler';

const apiDomain = document.querySelector('meta[name=domain]')?.content;

export async function fetchGuides(elemId, searchTerm = '') {
  const paramsObj = {};
  if (searchTerm.length) {
    paramsObj.q = searchTerm;
  }
  const resGuides = await fetch(
    `https://${apiDomain}/api/guide/list${
      Object.keys(paramsObj)?.length
        ? `?${new URLSearchParams(paramsObj).toString()}`
        : ''
    }`
  );
  const fetchData = await resGuides.json();
  $(`${elemId} .gas-list-results-info`).text(
    (fetchData?.count || 0) + ' result(s)'
  );

  listResponseHandler({
    listData: fetchData.results,
    elemId,
    numKeysToReplace: ['likes', 'comments'],
    textKeysToReplace: [
      'id',
      'name',
      'author',
      'description',
      'achievementId',
      'achievementName',
      'profileId',
    ],
  });
}
