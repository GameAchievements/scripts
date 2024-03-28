import { mutationTarget } from '../../utils/pagination/mutationTarget';
import { setupPagination } from '../../utils/pagination/setupPagination';
import { listResponseHandler } from './utils/listResponseHandler';

let totalPages = 1;
const perPage = 20;
const apiDomain = document.querySelector('meta[name=domain]')?.content;

export async function fetchAchievementsData(elemId, searchTerm = '') {
  const currentPage =
    $(`${elemId}-pagination .gas-filters-sw-li.active`).text() || 1;
  const filterTxt = $('.gas-filters-sw-li.active').first().text();
  const paramsObj = {};
  if (filterTxt !== 'All') {
    paramsObj.startsWith = filterTxt;
  }
  if (searchTerm.length) {
    paramsObj.q = searchTerm;
  }

  const urlStr = `https://${apiDomain}/api/achievement/list?perPage=${perPage}&offset=${
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
    const resAchievements = await resFetch.json();
    totalPages = Math.ceil((resAchievements?.count || 1) / perPage);
    listData = resAchievements.results;
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
    numKeysToReplace: [
      'id',
      'gameId',
      'points',
      'playersCount',
      'achieversCount',
      'completion',
      'gameTotalAchievements',
    ],
    textKeysToReplace: [
      'name',
      'gameName',
      'description',
      'updatedAt',
      'platformOriginalAchievementId',
    ],
  });
}

export async function loadAchievements(elemId) {
  await fetchAchievementsData(elemId);
  setupPagination({
    elemId: `${elemId}-pagination`,
    fetchFn: () => fetchAchievementsData(elemId),
    totalPages,
  });

  mutationTarget(elemId, () => fetchAchievementsData(elemId));
}
