// NOTE: if the parent element is corrupted (not found), undefined is returned
export const showImageFromSrc = (
  $img,
  url,
  parentSelector = '.gas-list-entry'
) =>
  $img
    .removeAttr('srcset')
    .removeAttr('sizes')
    .attr('src', url)
    .parents(parentSelector)
    .prop('outerHTML');
