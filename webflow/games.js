import { filterByLetter } from '../wrappers/GamesPage/FilterByLetter';
import { fetchGamesData, loadGames } from '../wrappers/GamesPage/GamesData';
import { setupListSearch } from '../utils';

$(async () => {
  await auth0Bootstrap();
  const gamesElemId = '#gas-list-games';
  $(`${gamesElemId} .gas-filters-sw-li`)
    .filter(function () {
      return $(this).parents(`${gamesElemId}-pagination`).length === 0;
    })
    .on('click', (ev) => filterByLetter(gamesElemId, ev));
  setupListSearch(gamesElemId, fetchGamesData);
  await loadGames(gamesElemId);

  $('.ga-loader-container').hide();
});
