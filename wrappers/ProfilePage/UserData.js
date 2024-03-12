import { showPlatform } from '../../utils';
import { linkPlatform } from './utils/linkPlatform';
import { unlinkPlatform } from './utils/unlinkPlatform';
const formMessageDelay = 4e3;

const elemIdPrefix = '#gas-profile';
let platformsToLink = Array.from(['playstation', 'xbox', 'steam']);

const setupLinkForms = (platformsLinked = []) => {
  $(`${elemIdPrefix}-pa-code-copied-msg`).hide();
  if (userProfileData.platformVerifierCode?.length) {
    $(`${elemIdPrefix}-pa-code`).text(userProfileData.platformVerifierCode);
    $(`${elemIdPrefix}-pa-code-btn`).on('click', async () => {
      await navigator.clipboard.writeText(userProfileData.platformVerifierCode);
      $(`${elemIdPrefix}-pa-code-copied-msg`).show();
      setTimeout(() => {
        $(`${elemIdPrefix}-pa-code-copied-msg`).hide();
      }, formMessageDelay);
    });
  } else {
    $(`${elemIdPrefix}-pa-code-btn`).hide();
  }
  platformsLinked.forEach((el) =>
    unlinkPlatform(el, platformsToLink, formMessageDelay)
  );
  platformsToLink.map((el) => linkPlatform(el, formMessageDelay));
};

const profileAvatarUpdater = async (platformsLinked) => {
  const $msgEl = $(`${elemIdPrefix}-msg-avatar`);
  if (!platformsLinked.length) {
    displayMessage(
      $msgEl,
      'Please link first a platform account in order to choose your avatar.',
      'unstyled',
      () => {
        $msgEl.css('display', 'flex');
      }
    );
  }
  platformsLinked.map(({ platform }) => {
    const platformName = platform.toLowerCase();
    $(`${elemIdPrefix}-btn-avatar-${platformName}`)
      .show()
      .click(async function () {
        const resFetch = await fetch(`${fetchURLPrefix}/avatar`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ platformId: platformNameIdMap(platformName) }),
        });
        if (resFetch.status !== 201) {
          displayMessage(
            $msgEl,
            'Oops! Issue changing avatar… Please try later.',
            'error'
          );
          return;
        }
        const resData = await resFetch.json();
        if (resData.imageURL?.length) {
          $('.gas-profile-avatar')
            .removeAttr('srcset')
            .removeAttr('sizes')
            .attr('src', resData.imageURL);
          displayMessage($msgEl, 'Avatar successfully changed!');
        }
      });
  });
};

function profileResponseHandler(res) {
  const elemId = `${elemIdPrefix}-details`;
  let dataTemplateActual = $(`${elemId}`).prop('outerHTML');
  console.info(`=== ${elemId} ===`, res);
  const textKeysToReplace = [
    'name',
    'description',
    'gaPoints',
    'guidesCount',
    'gamesCount',
    'completedCount',
    'completion',
    'achievedCount',
  ];
  Object.entries(res).forEach(([key, value]) => {
    if (textKeysToReplace.includes(key)) {
      dataTemplateActual = dataTemplateActual.replaceAll(`{|${key}|}`, value);
    } else if (key === 'ranking') {
      Object.entries(value).forEach(([rankKey, rankVal]) => {
        dataTemplateActual = dataTemplateActual.replaceAll(
          `{|${rankKey}|}`,
          rankVal
        );
      });
    } else if (key === 'platforms') {
      value.forEach(({ platform, accountName }) => {
        dataTemplateActual = dataTemplateActual.replaceAll(
          `{|${platform.toLowerCase()}Name|}`,
          accountName
        );
        dataTemplateActual = showPlatform(platform, dataTemplateActual, elemId);
      });
    }
  });
  $(`${elemId}`).prop('outerHTML', dataTemplateActual);
  // global (all sections) replacers
  if (!userAuth0Data?.sub?.length) {
    return;
  }
  profileAvatarUpdater(res.platforms);
  setupLinkForms(res.platforms);
  if (res.role?.length) {
    const isRegularRole = res.role.toLowerCase() === 'regular';
    $(`.gas-role${isRegularRole ? '' : '-non'}-regular`).show();
    if (!isRegularRole) {
      const $toggleCheckbox = $(`#gas-ads-toggle`);
      if (userProfileData.adsOff) {
        $toggleCheckbox.prop('checked', true);
      }
      $toggleCheckbox.on('change', async (evt) => {
        const fetchURL = `${fetchURLPrefix}/ads`;
        const resFetch = await fetch(fetchURL, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (resFetch.status !== 201) {
          // on error, reset to original state
          $toggleCheckbox.prop('checked', userProfileData.adsOff);
        }
        resData = await resFetch.json();
        if (resFetch.status === 201) {
          userProfileData.adsOff = !userProfileData.adsOff;
          sessionStorage.setItem('prof', JSON.stringify(userProfileData));
          if (resData?.message?.includes('deactivated')) {
            $('.ads-section').hide();
          } else {
            $('.ads-section').show();
          }
        }
        const msgType = resFetch.status === 201 ? 'success' : 'error';
        displayMessage(
          $(`#gas-ads-form .gas-form-${msgType}`),
          resData?.message,
          msgType
        );
      });
    }
  }
}

export async function fetchGAUserData(fetchURLPrefix, profileId) {
  let resData;
  if (profileId?.length) {
    const fetchURL = `${fetchURLPrefix}/id/${profileId}`;
    const resFetch = await fetch(fetchURL);
    if (resFetch.status !== 200) {
      return false; // redirect
    }
    resData = await resFetch.json();
  } else if (userProfileData) {
    resData = userProfileData;
  } else {
    return false; // login
  }
  if (!resData.visible) {
    return false; // redirect
  }
  if (resData.id?.length > 0) {
    document.title = `${resData.name?.length ? resData.name : resData.id} | ${
      document.title
    }`;
    profileResponseHandler(resData);
  }
  return true;
}
