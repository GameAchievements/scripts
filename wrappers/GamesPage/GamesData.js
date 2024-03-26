import { setupPagination } from '../../utils/pagination/setupPagination';
import { listResponseHandler } from './utils/listResponseHandler';

let totalPages = 1;
const pageBreakpoint = 7;
const perPage = 20;
const apiDomain = document.querySelector('meta[name=domain]')?.content;

export async function fetchGamesData(elemId, searchTerm = '') {
  const currentPage =
    $(`${elemId}-pagination .gas-filters-sw-li.active`).text() || 1;
  const filterTxt = $(`${elemId} .gas-filters-sw-li.active`).first().text();
  const paramsObj = {};
  if (filterTxt !== 'All') {
    paramsObj.startsWith = filterTxt;
  }
  if (searchTerm.length) {
    paramsObj.q = searchTerm;
  }
  const urlStr = `https://${apiDomain}/api/game/list?perPage=${perPage}&offset=${
    currentPage - 1
  }${
    Object.keys(paramsObj)?.length
      ? `&${new URLSearchParams(paramsObj).toString()}`
      : ''
  }`;

  const resGames = await fetch(urlStr);
  const fetchData = await resGames.json();
  totalPages = Math.ceil((fetchData?.count || 1) / perPage);
  $(`${elemId} .gas-list-results-info`).text(
    `${fetchData?.length || 0} result(s)`
  );

  listResponseHandler({
    listData: fetchData,
    elemId,
    numKeysToReplace: ['completion', 'achievementsCount'],
    textKeysToReplace: ['id', 'name', 'description', 'updatedAt'],
  });
}

export async function loadGames(elemId) {
  await fetchGamesData(elemId);
  setupPagination({
    elemId: `${elemId}-pagination`,
    fetchFn: () => fetchGamesData(elemId),
    pageBreakpoint,
    totalPages,
  });
}
