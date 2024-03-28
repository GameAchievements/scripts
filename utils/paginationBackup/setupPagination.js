import { filterByPage } from './FilterByPage';
import { renderPageBtn } from './RenderPageBtn';

export function setupPagination({
  elemId,
  fetchFn,
  pageBreakpoint,
  totalPages,
}) {
  $(`${elemId} .gas-filters-sw-li`).off('click');
  renderPageBtn(elemId, totalPages, pageBreakpoint);

  $(`${elemId} .gas-filters-sw-li`).on('click', (ev) => {
    filterByPage(elemId, totalPages, ev, () => fetchFn());
  });

  // //set active on first render
  $('#btn-page-1').addClass('active');
}
