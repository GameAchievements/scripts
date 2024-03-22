import { filterByPage } from './utils/pagination/FilterByPage';
import { listResponseHandler } from './utils/listResponseHandler';
import { renderPageBtn } from './utils/pagination/RenderPageBtn';

let totalPages = 1;
const pageBreakpoint = 7;

function setupPagination(elemId, apiDomain) {
  renderPageBtn(elemId, totalPages, pageBreakpoint);
  $(`${elemId} .gas-filters-sw-li`).on('click', (ev) =>
    filterByPage('#gas-home-list-guides', totalPages, pageBreakpoint, ev, () =>
      fetchGuidesData(elemId, apiDomain)
    )
  );

  //set active on first render
  $('#btn-page-1').addClass('active');
}

export async function fetchGuidesData(elemId, apiDomain) {
  const currentPage = $(`${elemId} .gas-filters-sw-li.active`).text() || 1;
  const perPage = 4;
  const resFetch = await fetch(
    `https://${apiDomain}/api/guide/list?perPage=${perPage}&orderBy=createdAt:desc&offset=${
      // currentPage - 1
      0
    }`
  );

  let listData = [];
  if (resFetch.ok) {
    const resData = await resFetch.json();
    // totalPages = Math.ceil((resData?.count || 0) / perPage);
    totalPages = 15;
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
