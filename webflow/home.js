import { fetchAchievements } from '../wrappers/HomePage/AchievementsData';
import { fetchGames } from '../wrappers/HomePage/GamesData';
import { loadGuides } from '../wrappers/HomePage/GuidesData';
import { homeMetricsHandler } from '../wrappers/HomePage/HomeMetrics';
import { fetchLatestThreads } from '../wrappers/HomePage/LastestThreadsData';

const apiDomain = document.querySelector('meta[name=domain]')?.content;

const elemIdPrefix = '#gas-home';

$(async () => {
  $('.ga-loader-container').show();
  await auth0Bootstrap();
  await Promise.all(
    ['recent', 'top'].map(
      async (type) => await fetchGames(type, apiDomain, elemIdPrefix)
    ),
    await homeMetricsHandler(apiDomain),
    await loadGuides(elemIdPrefix, apiDomain),
    await fetchAchievements(elemIdPrefix, apiDomain),
    await fetchLatestThreads(elemIdPrefix)
  );
});
