import { fetchAchievements } from '../wrappers/AchievementsPage/AchievementsData';
import { filterByLetter } from '../wrappers/AchievementsPage/FilterByLetter';
import { setupListSearch } from '../utils';

$().ready(async () => {
  await auth0Bootstrap();
  const achievementsElemId = '#gas-list-achievements';
  $(`${achievementsElemId} .gas-filters-sw-li`).on('click', (ev) =>
    filterByLetter(achievementsElemId, ev)
  );
  setupListSearch(achievementsElemId, fetchAchievements);
  await fetchAchievements(achievementsElemId);
  $('.ga-loader-container').hide();
});
