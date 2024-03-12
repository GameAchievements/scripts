import { loadAchievements } from '../components/ProfilePage/AchievementsData';
import { deleteProfile } from '../components/ProfilePage/DeleteProfile';
import { loadGames } from '../components/ProfilePage/GamesData';
import { loadGuides } from '../components/ProfilePage/GuidesData';
import { loadReviews } from '../components/ProfilePage/ReviewsData';
import { fetchGAUserData } from '../components/ProfilePage/UserData';
import { scrollToURLHash } from '../utils';

const apiDomain = document.querySelector('meta[name=domain]')?.content;
const urlParams = new URLSearchParams(location.search);
let profileId = urlParams.get('id');
const elemIdPrefix = '#gas-profile';
const fetchURLPrefix = `https://${apiDomain}/api/profile`;
const noProfileRedirectURL = '/';

$('.ga-loader-container').show();
$(
  '.action-message-wrapper,#ga-sections-container,.gas-role-non-regular,.gas-role-regular,' +
    `[id^=ga-pa-linked],[id^=ga-pa-to-link],[id^=${elemIdPrefix.slice(
      1
    )}-btn-avatar],[id^=${elemIdPrefix.slice(1)}-msg]`
).hide();

$(async () => {
  await auth0Bootstrap();
  if (profileId?.length) {
    $('#user-settings, #ga-user-settings-tab').hide();
  }
  if (await fetchGAUserData(fetchURLPrefix, profileId)) {
    await Promise.all([
      await loadGames(elemIdPrefix, profileId, fetchURLPrefix),
      await loadAchievements(elemIdPrefix, profileId, fetchURLPrefix),
      await loadGuides(elemIdPrefix, profileId, fetchURLPrefix),
      await loadReviews(elemIdPrefix, profileId, fetchURLPrefix),
    ]);
    $('.ga-loader-container').hide();
    $('#ga-sections-container').show();
    $(`${elemIdPrefix}-btn-delete`).on('click', deleteProfile);
    scrollToURLHash();
    $('#gas-wf-tab-activator').click();
    return;
  }
  if (!profileId?.length && login) {
    login();
    return;
  }
  location.replace(noProfileRedirectURL);
});
