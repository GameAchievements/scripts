import { generateNumbersArr } from './generateNumbersArr';

export function renderPageBtn(elemId, totalPages, currentPage = 1) {
  $('.gas-filters-sw-li.btn-page', $(elemId)).remove();
  $('.btn-ellipsis', $(elemId)).remove();
  $('#btn-page-next').removeClass('disabled');

  const $templateBtn = $('.gas-filters-sw-li.duplicate-btn', $(elemId));

  if (totalPages === 1) {
    $('#btn-page-next').addClass('disabled');
  }

  const pageNumbersArr = generateNumbersArr(totalPages, currentPage);

  for (const element of pageNumbersArr) {
    if (element === 'ellipsis') {
      addEllipsisBtn();
    } else {
      addPageBtn($templateBtn, element);
    }
  }
}

function addPageBtn(
  $entryElem,
  index,
  disabled,
  insert = { place: 'before', elementId: '#btn-page-next' } // place: 'before' | 'after'
) {
  const $pageBtn = $entryElem.clone();
  $pageBtn
    .text(index)
    .removeClass('duplicate-btn')
    .addClass(`btn-page ${disabled ?? ''}`)
    .attr('id', `btn-page-${index}`);

  if (insert.place === 'before') {
    $pageBtn.insertBefore(insert.elementId);
  } else {
    $pageBtn.insertAfter(insert.elementId);
  }
}

export function addEllipsisBtn(
  insert = { place: 'before', elementId: '#btn-page-next' } // place: 'before' | 'after'
) {
  const $ellipsis = $('<span class="btn-ellipsis">...</span>');
  if (insert.place === 'before') {
    $ellipsis.insertBefore(insert.elementId);
  } else {
    $ellipsis.insertAfter(insert.elementId);
  }
}
