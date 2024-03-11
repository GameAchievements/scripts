import { fetchAchievements } from '../components/AchievementsPage/AchievementsData';
import { filterByLetter } from '../components/AchievementsPage/FilterByLetter';
import { setupListSearch } from '../utils';

$(async () => {
  await auth0Bootstrap();
  const achievementsElemId = '#gas-list-achievements';
  $(`${achievementsElemId} .gas-filters-sw-li`).on('click', (ev) =>
    filterByLetter(achievementsElemId, ev)
  );
  setupListSearch(achievementsElemId, fetchAchievements);
  await fetchAchievements(achievementsElemId);
  $('.ga-loader-container').hide();
});
