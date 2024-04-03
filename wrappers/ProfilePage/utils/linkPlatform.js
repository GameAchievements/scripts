import { unlinkPlatform } from './unlinkPlatform';
import { platformNameIdMap } from '../../../utils';

export async function linkPlatform(
  platformName,
  fetchURLPrefix,
  formMessageDelay
) {
  const $toLinkCard = $(`#ga-pa-to-link-${platformName}`);
  $toLinkCard.show();
  const $linkField = $('input[name=external]', $toLinkCard);
  const $submitBtn = $('input[type=submit]', $toLinkCard);
  const $cardForm = $('.gas-link-pa-form', $toLinkCard);
  const $errEl = $('.gas-link-pa-error', $toLinkCard);
  $submitBtn.click(async (e) => {
    e.preventDefault();
    if (!$linkField.val()?.length) {
      $cardForm.hide();
      $errEl.css('display', 'flex');
      console.error('Please fill-in the input field with an id');
      setTimeout(() => {
        $errEl.hide();
        $cardForm.css('display', 'flex');
      }, formMessageDelay);
      return;
    }
    $('input', $toLinkCard).attr('disabled', true);
    const reqData = {
      platform: platformNameIdMap(platformName),
      external: $linkField.val(),
    };
    const resFecth = await fetch(`${fetchURLPrefix}/link-pa`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqData),
    });
    const paData = await resFecth.json();
    if (resFecth.status !== 201) {
      $errEl.css('display', 'flex');
      $cardForm.hide();
      console.error(paData?.message);
      setTimeout(() => {
        $errEl.hide();
        $('input', $toLinkCard).attr('disabled', false);
        $cardForm.css('display', 'flex');
      }, formMessageDelay);
      return;
    }
    $cardForm.hide();
    $('.gas-link-pa-success', $toLinkCard)
      .attr('title', paData?.message)
      .css('display', 'flex');
    setTimeout(() => {
      $toLinkCard.hide();
      unlinkPlatform({
        platform: platformName,
        accountId: paData?.platformAccount?.playerId,
        accountName: paData?.platformAccount?.playerName,
      });
      sessionStorage.removeItem('prof');
      location.reload();
    }, formMessageDelay);
  });
}
