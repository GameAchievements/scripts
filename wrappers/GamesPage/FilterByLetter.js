import { fetchGamesData } from './GamesData';

export async function filterByLetter(elemId, event) {
  const $letters = $('.gas-filters-sw-li', $(elemId)).filter(function () {
    return $(this).parents(`${elemId}-pagination`).length === 0;
  });
  $letters.removeClass('active');
  $(event.target).addClass('active');
  $('.ga-loader-container', $(elemId)).show();
  $('.gas-list,.gas-list-results-info', elemId).hide();
  await fetchGamesData(elemId);
  $('.gas-list-results-info', elemId).show();
  $('.ga-loader-container').hide();
}
