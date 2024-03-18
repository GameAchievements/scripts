export const setupListSearch = (elemId, fetchFn, extraParams = {}) => {
  $(`${elemId} .search-input`).removeAttr('required');
  $(`${elemId} form.search`).on('submit', async function (evt) {
    evt.preventDefault();
    searchTerm = new URLSearchParams($(this).serialize()).get('query');
    $('.ga-loader-container', elemId).show();
    $('.gas-list,.gas-list-results-info', elemId).hide();
    await fetchFn(elemId, searchTerm, extraParams);
    $('.gas-list-results-info', elemId).show();
    $('.ga-loader-container').hide();
  });
};
