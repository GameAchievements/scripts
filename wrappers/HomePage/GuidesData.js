import { setupPagination } from '../../utils/pagination/setupPagination';
import { listResponseHandler } from './utils/listResponseHandler';

let totalPages = 1;
const pageBreakpoint = 7;

export async function fetchGuidesData(elemId, apiDomain) {
  const currentPage = $(`${elemId} .gas-filters-sw-li.active`).text() || 1;
  const perPage = 4;
  const resFetch = await fetch(
    `https://${apiDomain}/api/guide/list?perPage=${perPage}&orderBy=createdAt:desc&offset=${
      currentPage - 1
    }`
  );

  let listData = [];
  if (resFetch.ok) {
    const resData = await resFetch.json();
    totalPages = Math.ceil((resData?.count || 1) / perPage);
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
  setupPagination({
    elemId: elemId,
    fetchFn: () => fetchGuidesData(elemId, apiDomain),
    pageBreakpoint,
    totalPages,
  });
}
