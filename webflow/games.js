import { filterByLetter } from '../components/GamesPage/FilterByLetter';
import { fetchGames } from '../components/GamesPage/GamesData';
import { setupListSearch } from '../utils';

$(async () => {
  await auth0Bootstrap();
  const gamesElemId = '#gas-list-games';
  $(`${gamesElemId} .gas-filters-sw-li`).on('click', (ev) =>
    filterByLetter(gamesElemId, ev)
  );
  setupListSearch(gamesElemId, fetchGames);
  await fetchGames(gamesElemId);
  $('.ga-loader-container').hide();
});
