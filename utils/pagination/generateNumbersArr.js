// How many pages can be around the current page
const maxAround = 1;
// How many pages are displayed if in beginning or end range
const maxRange = 5;
const maxElements = 7;

export function generateNumbersArr(totalPages, currentPage) {
  const endRange = totalPages - maxRange + 1;
  // Check if we're in the starting section
  const inStartRange = currentPage <= maxRange - 1;
  // Check if we're in the ending section
  const inEndRange = currentPage >= endRange + 1;

  if (totalPages <= maxElements)
    return Array.from({ length: totalPages }, (_, i) => i + 1);

  if (inStartRange) {
    return [
      ...Array.from({ length: maxRange }, (_, i) => i + 1),
      'ellipsis',
      totalPages,
    ];
  }
  if (inEndRange) {
    return [
      1,
      'ellipsis',
      ...Array.from({ length: maxRange }, (_, i) => totalPages - i).sort(),
    ];
  }
  return [
    1,
    'ellipsis',
    ...Array.from(
      { length: maxRange - 2 },
      (_, i) => currentPage - maxAround + i
    ),
    'ellipsis',
    totalPages,
  ];
}
