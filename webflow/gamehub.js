import { loadAchievers } from '../components/GamehubPage/AchieversSection';
import { versionsFetcher } from '../components/GamehubPage/AvailableVersionsSection';
import { fetchGamehub } from '../components/GamehubPage/GameHubData';
import { loadGuides } from '../components/GamehubPage/GuidesSection';
import { loadGameLatestThreads } from '../components/GamehubPage/LatestThreadsSection';
import { loadLeaderboards } from '../components/GamehubPage/LeaderboardsSection';
import { loadReviewSection } from '../components/GamehubPage/ReviewSection';
import { loadUserReviews } from '../components/GamehubPage/UserReviewsSection';
import { setupListSearch } from '../utils';

const apiDomain = document.querySelector('meta[name=domain]')?.content;

const urlParams = new URLSearchParams(location.search);
const gameId = urlParams.get('id') || 1044;
const gamehubURL = `https://${apiDomain}/api/game/${gameId}`;
const elemIdPrefix = `#gas-gh`;

$('.ga-loader-container').show();
$('#ga-sections-container').hide();

$(async () => {
  await auth0Bootstrap();
  const gamehubData = await fetchGamehub(gamehubURL, gameId);
  if (gamehubData) {
    loadReviewSection(gamehubURL, token, gamehubData);
    setupListSearch(`${elemIdPrefix}-leaderboard`, loadLeaderboards, {
      gameId,
    });
    await Promise.all([
      await versionsFetcher(gamehubData, gamehubURL),
      await loadLeaderboards(`${elemIdPrefix}-leaderboard`, '', { gameId }),
      await loadGuides(elemIdPrefix, gamehubURL),
      await loadUserReviews(elemIdPrefix, gamehubURL),
      await loadAchievers(gamehubURL),
      await loadGameLatestThreads(gamehubData),
    ]);
    $('.ga-loader-container').hide();
    $('#ga-sections-container').show();
    $('#gas-wf-tab-activator').click();
    return;
  }
});
