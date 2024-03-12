import { fetchLeaderboard } from '../wrappers/LeaderboardsPage/LeaderboardsData';
import { setupListSearch } from '../utils';

$('.ga-loader-container').show();
$('#ga-sections-container').hide();

$(async () => {
  const elemId = `#gas-leaderboard`;
  await auth0Bootstrap();
  setupListSearch(elemId, fetchLeaderboard);
  await fetchLeaderboard(elemId);
  $('.ga-loader-container').hide();
  $('#ga-sections-container').show();
});
