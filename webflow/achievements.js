import {
  fetchAchievementsData,
  loadAchievements,
} from '../wrappers/AchievementsPage/AchievementsData';
import { filterByLetter } from '../wrappers/AchievementsPage/FilterByLetter';
import { setupListSearch } from '../utils';

$(async () => {
  await auth0Bootstrap();
  const achievementsElemId = '#gas-list-achievements';

  $(`${achievementsElemId} .gas-filters-sw-li`)
    .filter(function () {
      return $(this).parents(`${achievementsElemId}-pagination`).length === 0;
    })
    .on('click', (ev) => filterByLetter(achievementsElemId, ev));
  setupListSearch(achievementsElemId, fetchAchievementsData);
  await loadAchievements(achievementsElemId);

  $('.ga-loader-container').hide();
});
