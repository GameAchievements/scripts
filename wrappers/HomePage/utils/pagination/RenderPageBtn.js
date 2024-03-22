export function renderPageBtn(elemId, totalPages) {
  const $templateBtn = $('.gas-filters-sw-li.duplicate-btn', $(elemId));

  if (totalPages === 1) {
    $('#btn-page-next').addClass('disabled');
    return;
  }

  const collapse = totalPages > 6;
  const lastIndex = !collapse ? totalPages : 6;

  for (let index = 2; index <= lastIndex; index++) {
    addPageBtn($templateBtn, index, {
      place: 'before',
      elementId: '#btn-page-next',
    });

    if (collapse && index === lastIndex) {
      addEllipsisBtn($templateBtn, {
        place: 'after',
        elementId: `#btn-page-${index}`,
      });
      addLastPageBtn($templateBtn, {
        place: 'before',
        elementId: '#btn-page-next',
      });
    }
  }
}

function addPageBtn(
  $entryElem,
  index,
  insert = { place: 'before', elementId: '#btn-page-next' }
) {
  const $pageBtn = $entryElem.clone();
  $pageBtn
    .text(index)
    .removeClass('duplicate-btn')
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
    .addClass('disabled')
    .prop('disabled', true);

  if (insert.place === 'before') {
    $ellipsisBtn.insertBefore(insert.elementId);
  } else {
    $ellipsisBtn.insertAfter(insert.elementId);
  }
}

function addLastPageBtn(
  $entryElem,
  insert = { place: 'before', elementId: '#btn-page-next' } // place: 'before' | 'after'
) {
  const $lastPageBtn = $entryElem.clone();
  $lastPageBtn.text(totalPages).removeClass('duplicate-btn');
  if (insert.place === 'before') {
    $lastPageBtn.insertBefore(insert.elementId);
  } else {
    $lastPageBtn.insertAfter(insert.elementId);
  }
}
