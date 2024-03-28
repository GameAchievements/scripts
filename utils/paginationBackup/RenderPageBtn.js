export function renderPageBtn(elemId, totalPages, pageBreakpoint) {
  $('.gas-filters-sw-li.btn-page', $(elemId)).remove();
  $('.btn-ellipsis', $(elemId)).remove();

  const $templateBtn = $('.gas-filters-sw-li.duplicate-btn', $(elemId));

  if (totalPages === 1) {
    $('#btn-page-next').addClass('disabled');
  }

  const collapse = totalPages > pageBreakpoint;
  const lastIndex = !collapse ? totalPages : pageBreakpoint - 1;

  for (let index = 1; index <= totalPages; index++) {
    const isHidden = index >= lastIndex && index !== totalPages;
    addPageBtn($templateBtn, index, isHidden ? 'hidden' : '', {
      place: 'before',
      elementId: '#btn-page-next',
    });
    if (index === totalPages && totalPages > pageBreakpoint) {
      addEllipsisBtn({
        place: 'before',
        elementId: `#btn-page-${index}`,
      });
    }
  }
}

function addPageBtn(
  $entryElem,
  index,
  disabled,
  insert = { place: 'before', elementId: '#btn-page-next' }
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
