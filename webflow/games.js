import { filterByLetter } from '../wrappers/GamesPage/FilterByLetter';
import { fetchGames } from '../wrappers/GamesPage/GamesData';
import { setupListSearch } from '../utils';

$().ready(async () => {
  await auth0Bootstrap();
  const gamesElemId = '#gas-list-games';
  $(`${gamesElemId} .gas-filters-sw-li`).on('click', (ev) =>
    filterByLetter(gamesElemId, ev)
  );
  setupListSearch(gamesElemId, fetchGames);
  await fetchGames(gamesElemId);
  $('.ga-loader-container').hide();
});
