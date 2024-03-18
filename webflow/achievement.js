import { verifyAuthenticatedUserGuideData } from '../wrappers/AchievementPage/VerifyAuthUserGuideData';
import { loadAchieversSection } from '../wrappers/AchievementPage/AchieversSection';
import { loadGuidesSection } from '../wrappers/AchievementPage/GuidesSection';
import { fetchAchievement } from '../wrappers/AchievementPage/AchievementData';

const apiDomain = document.querySelector('meta[name=domain]')?.content;
const urlParams = new URLSearchParams(window.location.search);
const achievementId = urlParams.get('id') || 1044;
const elemIdPrefix = '#gas-achievement';

$('.ga-loader-container').show();
$('#ga-sections-container').hide();

$(async () => {
  await auth0Bootstrap();
  await verifyAuthenticatedUserGuideData(
    elemIdPrefix,
    token,
    apiDomain,
    achievementId
  );
  if (await fetchAchievement(elemIdPrefix, apiDomain, achievementId)) {
    await Promise.all([
      await loadGuidesSection(elemIdPrefix, apiDomain, achievementId),
      await loadAchieversSection(elemIdPrefix, apiDomain, achievementId),
    ]);
    $('.ga-loader-container').hide();
    $('#ga-sections-container').show();
    $('#gas-wf-tab-activator').click();
    return;
  }
  window.location.replace('/achievements');
});
