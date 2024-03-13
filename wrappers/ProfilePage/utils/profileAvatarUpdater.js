import { displayMessage, platformNameIdMap } from '../../../utils';

export async function profileAvatarUpdater(
  platformsLinked,
  elemIdPrefix,
  fetchURLPrefix
) {
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
}
