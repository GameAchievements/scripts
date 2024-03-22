export async function filterByPage(
  elemId,
  totalPages,
  pageBreakpoint,
  event,
  fetchFn
) {
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
  setCurrentPage(Number(targetPage), totalPages, pageBreakpoint, $(elemId));
  await fetchFn();
}

// How many pages can be around the current page
const maxAround = 1;
// How many pages are displayed if in beginning or end range
const maxRange = 3;

function setCurrentPage(pageNum, totalPages, pageBreakpoint, elemId) {
  const endRange = totalPages - maxRange;
  // Check if we're in the starting section
  const inStartRange = pageNum <= maxRange;
  // Check if we're in the ending section
  const inEndRange = pageNum >= endRange;

  // We need this for the span(s)
  let lastDotIndex = -1;

  // Remove all dots
  $('.btn-ellipsis').remove();
  // Loop the pages
  $('.gas-filters-sw')
    .children(':not(duplicate-btn):not(#btn-page-previous):not(#btn-page-next)')
    .each((page, element) => {
      // Index starts at 0, pages at 1
      const idx = page + 1;
      const $element = $(element);
      if (idx === 1 || idx === totalPages) {
        // Always show first and last
        $element.show();
      } else if (inStartRange && idx <= maxRange) {
        // Show element if in start range
        $element.show();
      } else if (inEndRange && idx >= endRange) {
        // Show the element if in ending range
        $element.show();
      } else if (
        idx === pageNum - maxAround ||
        idx === pageNum ||
        idx === pageNum + maxAround
      ) {
        // Show element if in the wrap around
        $element.show();
      } else {
        // Doesn't validate, hide it.
        // Append dot if needed
        $element.hide();

        if (
          lastDotIndex === -1 ||
          (!inStartRange &&
            !inEndRange &&
            $('span.dots').length < 2 &&
            idx > currentPage)
        ) {
          lastDotIndex = idx;
          // Insert dots after this page, we only have one or 2, and we can only insert the second one
          // if we're not in the start or end range, and it's past the current page
          $element.after('<span class="dots">...</span>');
        }
      }
    });
}
