import { addEllipsisBtn } from './RenderPageBtn';

// How many pages can be around the current page
const maxAround = 1;
// How many pages are displayed if in beginning or end range
const maxRange = 5;

export function handlePageChange(currentPage, totalPages, elemId) {
  const endRange = totalPages - maxRange + 1;
  // Check if we're in the starting section
  const inStartRange = currentPage <= maxRange - 1;
  // Check if we're in the ending section
  const inEndRange = currentPage >= endRange + 1;

  // We need this for the span(s)
  let lastDotIndex = -1;

  // Remove all dots
  $('.btn-ellipsis', $(elemId)).remove();

  // Loop the pages
  $('.gas-filters-sw', $(elemId))
    .children(
      ':not(#btn-page-previous):not(#btn-page-next):not(.duplicate-btn)'
    )
    .each((page, element) => {
      // Index starts at 0, pages at 1
      const idx = page + 1;

      const $element = $(element);

      if (idx === 1 || idx === totalPages) {
        // Always show first and last
        $element.removeClass('hidden');
      } else if (inStartRange && idx <= maxRange) {
        // Show element if in start range
        $element.removeClass('hidden');
      } else if (inEndRange && idx >= endRange) {
        // Show the element if in ending range
        $element.removeClass('hidden');
      } else if (
        idx === currentPage - maxAround ||
        idx === currentPage ||
        idx === currentPage + maxAround
      ) {
        // Show element if in the wrap around
        $element.removeClass('hidden');
      } else {
        // Doesn't validate, hide it.
        // Append dot if needed
        $element.addClass('hidden');
        if (
          lastDotIndex === -1 ||
          (!inStartRange &&
            !inEndRange &&
            $('span.btn-ellipsis', elemId).length < 2 &&
            idx > currentPage)
        ) {
          lastDotIndex = idx;
          // Insert dots after this page, we only have one or 2, and we can only insert the second one
          // if we're not in the start or end range, and it's past the current page
          addEllipsisBtn({ place: 'after', elementId: element });
        }
      }
    });
}
