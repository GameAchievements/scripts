import { fetchGames } from './GamesData';

export async function filterByLetter(elemId, event) {
  $('.gas-filters-sw-li', $(elemId)).removeClass('active');
  $(event.target).addClass('active');
  $('.ga-loader-container', $(elemId)).show();
  $('.gas-list,.gas-list-results-info', elemId).hide();
  await fetchGames(elemId);
  $('.gas-list-results-info', elemId).show();
  $('.ga-loader-container').hide();
}
