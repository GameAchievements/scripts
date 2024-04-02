import { platformNameShortMap, showPlatform } from '../../utils';
import { linkPlatform } from './utils/linkPlatform';
import { profileAvatarUpdater } from './utils/profileAvatarUpdater';
import { unlinkPlatform } from './utils/unlinkPlatform';
const formMessageDelay = 4e3;

const elemIdPrefix = '#gas-profile';

const platformsToLink = ['playstation', 'xbox', 'steam'];

function setupLinkForms(fetchURLPrefix, platformsLinked = []) {
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

  //setup form TO UNLINK platforms
  for (const el of platformsLinked) {
    unlinkPlatform(el, fetchURLPrefix, platformsToLink, formMessageDelay);
  }

  //setup form TO LINK platforms
  const platformsNotLinked = platformsToLink.filter(
    (el) =>
      !platformsLinked
        .map(({ platform }) => platform.toLowerCase())
        .includes(el)
  );
  for (const el of platformsNotLinked) {
    linkPlatform(el, fetchURLPrefix, formMessageDelay);
  }
}

function profileResponseHandler(res, fetchURLPrefix) {
  const elemId = `${elemIdPrefix}-details`;
  let dataTemplateActual = $(`${elemId}`).prop('outerHTML');
  console.info(`=== ${elemId} ===`, res);
  const textKeysToReplace = [
    'name',
    'description',
    'guidesCount',
    'gamesCount',
    'completedCount',
    'completion',
    'achievedCount',
  ];

  for (const [key, value] of Object.entries(res)) {
    if (textKeysToReplace.includes(key)) {
      dataTemplateActual = dataTemplateActual.replaceAll(`{|${key}|}`, value);
    } else if (key === 'gaPoints') {
      dataTemplateActual = dataTemplateActual.replaceAll(
        '{|gaPoints|}',
        res.platforms.find((el) => el.platform === 'GA')?.gaUserScore ?? 0
      );
    } else if (key === 'platforms') {
      const platformKeysToReplace = [
        'accountName',
        'totalGames',
        'completion',
        'ranking',
      ];
      for (const platformItem of value) {
        for (const platformKey of platformKeysToReplace) {
          dataTemplateActual = dataTemplateActual.replaceAll(
            `{|${platformNameShortMap(platformItem.platform)}-${platformKey}|}`,
            platformItem[platformKey] ?? 'N.A'
          );
        }

        dataTemplateActual = showPlatform(
          platformItem.platform,
          dataTemplateActual,
          elemId
        );
      }
    }
  }

  $(`${elemId}`).prop('outerHTML', dataTemplateActual);
  // global (all sections) replacers
  if (!userAuth0Data?.sub?.length) {
    return;
  }
  profileAvatarUpdater(res.platforms, elemIdPrefix, fetchURLPrefix);
  setupLinkForms(fetchURLPrefix, res.platforms);
  if (res.role?.length) {
    const isRegularRole = res.role.toLowerCase() === 'regular';
    $(`.gas-role${isRegularRole ? '' : '-non'}-regular`).show();
    if (!isRegularRole) {
      const $toggleCheckbox = $('#gas-ads-toggle');
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

  //replace name with logged user name on community section
  let $entryElem = $('.community-div .heading-description-wrapper');
  const $entryElemTemplate = $entryElem
    .prop('outerHTML')
    .replaceAll('{|name|}', res.name);
  $entryElem = $entryElem.prop('outerHTML', $entryElemTemplate);
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
    profileResponseHandler(resData, fetchURLPrefix);
  }
  return true;
}
