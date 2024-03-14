const apiDomain = document.querySelector('meta[name=domain]')?.content;
const igdbFormId = '#gas-management-igdb-form';
const formMessageDelay = 4000;

const fieldFocus = (fieldEl) => {
  const $submitBtn = $('.submit-button', igdbFormId);
  if (!$(fieldEl).val()?.length) {
    // only contentField required
    $(fieldEl).prev('label').addClass('field-label-missing');
    $submitBtn.addClass('disabled-button').attr('disabled', true);
  } else {
    $(fieldEl).prev('label').removeClass('field-label-missing');
    let allFilled = true;
    $(fieldEl)
      .siblings('input')
      .each((idx, sibEl) => {
        if (!$(sibEl).val().length) {
          allFilled = false;
        }
      });
    if (allFilled) {
      $submitBtn.removeClass('disabled-button').attr('disabled', false);
    }
  }
};

const setupIGDBForm = () => {
  const $submitBtn = $('.submit-button', igdbFormId);
  $submitBtn.attr('disabled', true);
  const $gameField = $('[name=game]', igdbFormId);
  const $igdbField = $('[name=igdb]', igdbFormId);
  const submitText = $submitBtn.text();
  const $errEl = $('.gas-form-error', igdbFormId);
  const $errorDiv = $('div', $errEl);
  const txtError = $errEl.text();
  const $successEl = $('.gas-form-success', igdbFormId);
  $gameField.on('focusout keyup', (ev) => fieldFocus(ev.target));
  $igdbField.on('focusout keyup', (ev) => fieldFocus(ev.target));
  $submitBtn.on('click', async (e) => {
    e.preventDefault();
    if (!$gameField.val().length || !$igdbField.val().length) {
      $errEl.show();
      $errorDiv.text('Please add both numeric IDs above');
      setTimeout(() => {
        $errEl.hide();
        $errorDiv.text(txtError);
      }, formMessageDelay);
      return;
    }
    // disable show popup on leave page (site-settings)
    isUserInputActive = false;
    $submitBtn.text($submitBtn.data('wait'));
    const resFetch = await fetch(
      `https://${apiDomain}/api/game/igdb-link-to-game`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          igdbId: $igdbField.val(),
          gameId: $gameField.val(),
        }),
      }
    );
    const revData = await resFetch.json();
    if (resFetch.status !== 201) {
      $errEl.show();
      $errorDiv.text(revData?.message);
      setTimeout(() => {
        $errEl.hide();
        $errorDiv.text(txtError);
        $submitBtn.text(submitText);
      }, formMessageDelay * 2);
      return;
    }
    $successEl.attr('title', revData?.message).show();
    setTimeout(() => {
      $successEl.hide();
    }, formMessageDelay);
  });
};

$(async () => {
  await auth0Bootstrap();
  const roleName = userProfileData?.role?.toLowerCase();
  if (roleName !== 'manager') {
    location.replace('/');
    return;
  }
  setupIGDBForm();
});
