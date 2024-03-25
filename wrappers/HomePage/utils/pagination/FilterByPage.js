import { handlePageChange } from './HandlePageChange';

export async function filterByPage(elemId, totalPages, event, fetchFn) {
  const currentPage = $('.gas-filters-sw-li.active', $(elemId)).first().text();
  const targetPage =
    event.target.innerText.toLowerCase() === 'next'
      ? Number(currentPage) + 1
      : event.target.innerText.toLowerCase() === 'previous'
      ? Number(currentPage) - 1
      : Number(event.target.innerText);
  $('.gas-filters-sw-li:not(.btn-ellipsis)', $(elemId))
    .removeClass('active')
    .removeClass('disabled');
  $(`#btn-page-${targetPage}`, $(elemId)).addClass('active');

  if (targetPage === totalPages) {
    $('#btn-page-next', $(elemId)).addClass('disabled');
  } else if (targetPage === 1) {
    $('#btn-page-previous', $(elemId)).addClass('disabled');
  }
  handlePageChange(Number(targetPage), totalPages);
  await fetchFn();
}
