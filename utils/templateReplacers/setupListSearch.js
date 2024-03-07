export const setupListSearch = (elemId, fetchFn) => {
  $(`${elemId} form.search`).on('submit', async function (evt) {
    evt.preventDefault();
    searchTerm = new URLSearchParams($(this).serialize()).get('query');
    if (searchTerm?.length) {
      $('.ga-loader-container', elemId).show();
      $('.gas-list,.gas-list-results-info', elemId).hide();
      await fetchFn(elemId, searchTerm);
      $('.gas-list-results-info', elemId).show();
      $('.ga-loader-container').hide();
    }
  });
};
