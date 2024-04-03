import { loadAchievements } from '../wrappers/ProfilePage/AchievementsData';
import { deleteProfile } from '../wrappers/ProfilePage/DeleteProfile';
import { loadGames } from '../wrappers/ProfilePage/GamesData';
import { loadGuides } from '../wrappers/ProfilePage/GuidesData';
import { loadReviews } from '../wrappers/ProfilePage/ReviewsData';
import { fetchGAUserData } from '../wrappers/ProfilePage/UserData';
import { scrollToURLHash } from '../utils';

const apiDomain = document.querySelector('meta[name=domain]')?.content;
const urlParams = new URLSearchParams(location.search);
const profileId = urlParams.get('id');
const elemIdPrefix = '#gas-profile';
const fetchURLPrefix = `https://${apiDomain}/api/profile`;
const noProfileRedirectURL = '/';

$('.ga-loader-container').show();
$(
  `.action-message-wrapper,#ga-sections-container,.gas-role-non-regular,.gas-role-regular,[id^=ga-pa-linked],[id^=ga-pa-to-link],[id^=${elemIdPrefix.slice(
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
      await loadGames(elemIdPrefix, apiDomain, profileId),
      await loadAchievements(elemIdPrefix, profileId, fetchURLPrefix),
      await loadGuides(elemIdPrefix, apiDomain, profileId),
      await loadReviews(elemIdPrefix, apiDomain, profileId),
    ]);

    $('.ga-loader-container').hide();
    $('#ga-sections-container').show();
    $(`${elemIdPrefix}-btn-delete`).on('click', () =>
      deleteProfile(apiDomain, elemIdPrefix)
    );
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
