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

  const resFetch = await fetch(urlStr);
  let listData = [];
  const totalPagesAux = totalPages;
  if (resFetch.ok) {
    const resGames = await resFetch.json();
    totalPages = Math.ceil((resGames?.count || 1) / perPage);
    listData = resGames.results;
  }

  $(`${elemId} .gas-list-results-info`).text(
    `${listData?.length || 0} result(s)`
  );

  if (totalPagesAux !== totalPages) {
    $(`${elemId} .gas-list-total-pages-info`).text(totalPages);
  }

  listResponseHandler({
    listData,
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

  mutationTarget(elemId);
}

function mutationTarget(elemId) {
  const targetNodes = $('.gas-list-total-pages-info');
  const MutationObserver = window.MutationObserver;
  const myObserver = new MutationObserver(mutationHandler);

  targetNodes.each(function () {
    myObserver.observe(this, {
      childList: true,
    });
  });

  function mutationHandler(mutationRecords) {
    for (const mutation of mutationRecords) {
      if (mutation.addedNodes.length > 0) {
        const pages = Number(mutation.addedNodes[0].data);
        setupPagination({
          elemId: `${elemId}-pagination`,
          fetchFn: () => fetchGamesData(elemId),
          pageBreakpoint,
          totalPages: pages,
        });
      }
    }
  }
}
