import { fetchAchievements } from '../components/HomePage/AchievementsData';
import { fetchGames } from '../components/HomePage/GamesData';
import { fetchGuides } from '../components/HomePage/GuidesData';
import { homeMetricsHandler } from '../components/HomePage/HomeMetrics';
import { fetchLatestThreads } from '../components/HomePage/LastestThreadsData';

const apiDomain = document.querySelector('meta[name=domain]')?.content;

const elemIdPrefix = `#gas-home`;

$(async () => {
  $(`.ga-loader-container`).show();
  await auth0Bootstrap();
  await Promise.all(
    ['recent', 'top'].map(
      async (type) => await fetchGames(type, apiDomain, elemIdPrefix)
    )
  );
  await homeMetricsHandler(apiDomain);
  await fetchGuides(elemIdPrefix, apiDomain);
  await fetchAchievements(elemIdPrefix, apiDomain);
  await fetchLatestThreads(elemIdPrefix);
});
