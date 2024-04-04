import { filterByPage } from './FilterByPage';
import { renderPageBtn } from './RenderPageBtn';

export function setupPagination({ elemId, fetchFn, totalPages }) {
  $(`${elemId} .gas-filters-sw-li`).off('click');
  renderPageBtn(elemId, totalPages);

  // //set active on first render
  $('#btn-page-1').addClass('active');

  $(`${elemId} .gas-filters-sw-li`).on('click', (ev) => {
    filterByPage(elemId, totalPages, ev, () => fetchFn());
  });
}
