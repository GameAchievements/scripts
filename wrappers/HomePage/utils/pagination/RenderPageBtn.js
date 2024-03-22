export function renderPageBtn(elemId, totalPages, pageBreakpoint) {
  const $templateBtn = $('.gas-filters-sw-li.duplicate-btn', $(elemId));

  if (totalPages === 1) {
    $('#btn-page-next').addClass('disabled');
    return;
  }

  const collapse = totalPages > pageBreakpoint;
  const lastIndex = !collapse ? totalPages : pageBreakpoint - 1;

  for (let index = 1; index <= totalPages; index++) {
    const isHidden = index >= lastIndex && index !== totalPages;
    addPageBtn($templateBtn, index, isHidden ? 'hidden' : '', {
      place: 'before',
      elementId: '#btn-page-next',
    });
    if (index === totalPages) {
      addEllipsisBtn($templateBtn, {
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

function addEllipsisBtn(
  $entryElem,
  insert = { place: 'before', elementId: '#btn-page-next' } // place: 'before' | 'after'
) {
  const $ellipsisBtn = $entryElem.clone();
  $ellipsisBtn
    .text('...')
    .removeClass('duplicate-btn')
    .addClass('disabled btn-ellipsis');

  if (insert.place === 'before') {
    $ellipsisBtn.insertBefore(insert.elementId);
  } else {
    $ellipsisBtn.insertAfter(insert.elementId);
  }
}
