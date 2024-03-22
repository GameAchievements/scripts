import { filterByPage } from './utils/pagination/FilterByPage';
import { listResponseHandler } from './utils/listResponseHandler';
import { renderPageBtn } from './utils/pagination/RenderPageBtn';

let totalPages = 1;

function setupPagination(elemId, apiDomain) {
  renderPageBtn(elemId, totalPages);
  $(`${elemId} .gas-filters-sw-li`).on('click', (ev) =>
    filterByPage('#gas-home-list-guides', totalPages, ev, () =>
      fetchGuidesData(elemId, apiDomain)
    )
  );
}

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
    totalPages = Math.ceil((resData?.count || 0) / perPage);
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
  await fetchGuidesData(`${elemIdPrefix}-list-guides`, apiDomain);
  setupPagination(`${elemIdPrefix}-list-guides`, apiDomain);
}
