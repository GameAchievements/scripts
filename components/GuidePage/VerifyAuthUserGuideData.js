let achievementId = 0;
let hasLike;

function setupLike(hasLikeFromFetch) {
  hasLike = hasLikeFromFetch;
  const $btnLike = $(`${elemIdPrefix}-btn-like`);
  const $btnDelLike = $(`${elemIdPrefix}-btn-like-del`);

  if (hasLike) {
    $btnLike.hide();
  } else {
    $btnDelLike.hide();
  }

  const changeLikeStatus = async () => {
    $btnLike.attr('disabled', true);
    $btnDelLike.attr('disabled', true);
    const resFetch = await fetch(
      `https://${apiDomain}/api/guide/${guideId}/upvote`,
      { method: 'POST', headers: { Authorization: `Bearer ${token}` } }
    );
    const $likesCount = $(`${elemIdPrefix}-upvotes-count`);
    const countChange = hasLike ? -1 : 1;
    hasLike = !hasLike;
    $likesCount.text(Number($likesCount.text() || 0) + countChange);
    if (resFetch.status === 204) {
      $btnLike.attr('disabled', false).show();
      $btnDelLike.hide();
      return;
    }
    $btnLike.hide();
    $btnDelLike.attr('disabled', false).show();
  };

  $btnLike.on('click', changeLikeStatus);
  $btnDelLike.on('click', changeLikeStatus);
}

const setupCommentForm = (hasComment) => {
  const formWrapperId = `${elemIdPrefix}-comment-form`;
  if (hasComment) {
    $(`${elemIdPrefix}-btn-add-comment`).hide();
    $(formWrapperId).parent().hide();
    return;
  }
  const formMessageDelay = 4000;
  const $submitBtn = $(`.submit-button`, formWrapperId);
  $submitBtn.attr('disabled', true);
  const $contentField = $(`[name=comment]`, formWrapperId);
  const submitText = $submitBtn.text();
  const $errEl = $('.gas-form-error', formWrapperId);
  const $errorDiv = $('div', $errEl);
  const txtError = $errEl.text();
  const $successEl = $('.gas-form-success', formWrapperId);
  $contentField.on('focusout keyup', function () {
    if (!$(this).val()?.length) {
      // only contentField required
      $(this).prev('label').addClass('field-label-missing');
      $submitBtn.addClass('disabled-button').attr('disabled', true);
    } else {
      $(this).prev('label').removeClass('field-label-missing');
      $submitBtn.removeClass('disabled-button').attr('disabled', false);
    }
  });
  $submitBtn.on('click', async (e) => {
    e.preventDefault();
    if (!$contentField.val().length) {
      $errEl.show();
      $errorDiv.text('Please write your comment in the box above');
      setTimeout(() => {
        $errEl.hide();
        $errorDiv.text(txtError);
      }, formMessageDelay);
      return;
    }
    // disable show popup on leave page (site-settings)
    isUserInputActive = false;
    $(`input`, formWrapperId).attr('disabled', true);
    $submitBtn.text($submitBtn.data('wait'));
    const resFetch = await fetch(
      `https://${apiDomain}/api/guide/${guideId}/comment`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment: $contentField.val() }),
      }
    );
    const revData = await resFetch.json();
    if (resFetch.status !== 201) {
      $errEl.show();
      $errorDiv.text(revData?.message);
      setTimeout(() => {
        $errEl.hide();
        $errorDiv.text(txtError);
        $(`input`, formWrapperId).attr('disabled', false);
        $submitBtn.text(submitText);
      }, formMessageDelay);
      return;
    }
    $(`form`, formWrapperId).hide();
    $successEl.attr('title', revData?.message).show();
    setTimeout(() => {
      location.reload();
    }, formMessageDelay);
  });
};

export async function verifyAuthenticatedUserGuideData() {
  if (!token || !achievementId) {
    return;
  }
  const resFetch = await fetch(
    `https://${apiDomain}/api/achievement/${achievementId}/guide-auth-user-data?id=${guideId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (resFetch.status !== 200) {
    // auth user not found/issue, do not allow access to auth ops
    $(`${elemIdPrefix}-nav-auth`).hide();
    $(`${elemIdPrefix}-comment-form`).parent().hide();
    return;
  }
  const revData = await resFetch.json();
  const $editBtn = $(`${elemIdPrefix}-btn-edit`);
  if (revData.ownedGuideId > 0) {
    $editBtn.attr('href', `/guide-form?id=${revData.ownedGuideId}`).show();
  } else {
    $editBtn.hide();
  }
  setupLike(revData.hasLike);
  setupCommentForm(revData.hasComment);
}
