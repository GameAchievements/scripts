import { ratingSVG, ratingScale } from '../../utils';

const elemIdPrefix = '#gas-gh';

function setupGAReview(gamehubData) {
  $('#official-review-game-title').text(gamehubData.name);
  $(`${elemIdPrefix}-top-ga-score`).prepend(ratingSVG(0));
  $(`${elemIdPrefix}-top-ga-score-text`).text('-');
  if (!gamehubData?.gaReviewURL?.length) {
    // without URL, do not display official review
    return;
  }
  const gaReviewSectionId = `${elemIdPrefix}-official-review`;

  $(gaReviewSectionId).css('display', 'flex');
  $(`${gaReviewSectionId}-placeholder`).hide();
  $(`${gaReviewSectionId}-url`).attr('href', gamehubData.gaReviewURL);
  if (gamehubData?.gaReviewSummary?.length) {
    $(`${gaReviewSectionId}-summary`).text(gamehubData.gaReviewSummary);
  }
  if (gamehubData?.gaReviewScore) {
    const roundedRate = Math.round(gamehubData.gaReviewScore);
    const rateEl = ratingSVG(roundedRate);
    $(`${gaReviewSectionId}-score-text`).text(roundedRate);
    $(`${gaReviewSectionId}-score-bg`).replaceWith(rateEl);
    $(`${elemIdPrefix}-top-ga-score .bg-review-score`).replaceWith(rateEl);
    $(`${elemIdPrefix}-top-ga-score-text`).text(roundedRate);
  } else {
    $(`${gaReviewSectionId}-score`).parent().remove();
  }
}

async function setupReviewForm(gamehubURL, token) {
  const formWrapperId = `${elemIdPrefix}-review-form`;
  const resReview = await fetch(`${gamehubURL}/review`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (resReview.status === 200) {
    $(formWrapperId).remove();
    return;
  }
  const $submitBtn = $('.submit-button', formWrapperId);
  $submitBtn.attr('disabled', true);
  const $titleField = $('[name=title]', formWrapperId);
  const $contentField = $('[name=content]', formWrapperId);
  const $requiredFields = $('[name][required]', formWrapperId);
  const submitText = $submitBtn.val();
  const $errEl = $('.gas-form-error', formWrapperId);
  const $errorDiv = $('div', $errEl);
  const txtError = $errEl.text();
  const $successEl = $('.gas-form-success', formWrapperId);
  const $ratingScale = $('.gas-rating-scale', formWrapperId);
  const $rateChosen = $('.gas-rating-selected', formWrapperId);
  ratingScale($ratingScale, $rateChosen);
  let requiredFilled = false;
  const canSubmit = () => {
    if (requiredFilled && Number($rateChosen.data('rate'))) {
      $submitBtn.removeClass('disabled-button').attr('disabled', false);
    }
  };

  $requiredFields.on('focusout keyup', () => {
    $requiredFields.each(function () {
      if (!$(this).val()?.length) {
        requiredFilled = false;
        $(this).prev('label').addClass('field-label-missing');
        $submitBtn.addClass('disabled-button').attr('disabled', true);
      } else {
        requiredFilled = true;
        $(this).prev('label').removeClass('field-label-missing');
      }
    });
    canSubmit();
  });
  $('li', $ratingScale).one('click', () => {
    $ratingScale.parent().prev('label').removeClass('field-label-missing');
    canSubmit();
  });
  $submitBtn.on('click', async (e) => {
    e.preventDefault();
    const rating = Number($rateChosen.data('rate') || 0);
    if (!rating || !$titleField.val()?.length || !$contentField.val().length) {
      $errEl.show();
      $errorDiv.text('Please choose a rating and fill-in required fields');
      setTimeout(() => {
        $errEl.hide();
        $errorDiv.text(txtError);
      }, formMessageDelay);
      return;
    }
    // disable show popup on leave page (site-settings)
    isUserInputActive = false;
    $('input', formWrapperId).attr('disabled', true);
    $submitBtn.val($submitBtn.data('wait'));
    const reqData = {
      title: $titleField.val(),
      content: $contentField.val(),
      rating,
    };
    const resFecth = await fetch(`${gamehubURL}/review`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqData),
    });
    const revData = await resFecth.json();
    if (resFecth.status !== 201) {
      $errEl.show();
      $errorDiv.text(revData?.message);
      setTimeout(() => {
        $errEl.hide();
        $errorDiv.text(txtError);
        $('input', formWrapperId).attr('disabled', false);
        $submitBtn.val(submitText);
      }, formMessageDelay);
      return;
    }
    $('form', formWrapperId).hide();
    $successEl.attr('title', revData?.message).show();
    setTimeout(() => {
      location.reload();
    }, formMessageDelay);
  });
}

export async function loadReviewSection(gamehubURL, token, gamehubData) {
  setupGAReview(gamehubData);
  await setupReviewForm(gamehubURL, token);
}

export function reviewsBarsHandler({ listData, elemId }) {
  const $barsContainer = $(`${elemId}-bars`);
  let barItems = [];
  const bars = ['positive', 'mixed', 'negative'];
  if (listData.length) {
    for (const barName of bars) {
      barItems = listData.filter(
        (item) => item.classification?.toLowerCase() === barName
      );
      const $bar = $(`.gas-bar-${barName}`, $barsContainer);
      if ($bar.length) {
        // when barItems == 0, 1% width shows a little bit of the bar
        $bar.css('width', `${100 * (barItems.length / listData.length) || 1}%`);
      }
      const $barText = $(`.gas-bar-text-${barName}`, $barsContainer);
      if ($barText.length) {
        $barText.text(barItems?.length);
      }
    }

    const avgRating = Math.round(
      listData
        .map((li) => li.rating)
        .reduce((prevLi, currLi) => prevLi + currLi) / listData.length
    );
    $('.gas-avg-rate-wrapper').each((idx, rateEl) => {
      $(rateEl).prepend(ratingSVG(avgRating));
      $('.gas-avg-rate-text', rateEl).text(avgRating);
    });
  } else {
    for (const barName of bars) {
      $(`.gas-bar-${barName}`, $barsContainer).css('width', '1%');
    }
    $('.gas-avg-rate-wrapper').each((idx, rateEl) => {
      $(rateEl).prepend(ratingSVG(0));
      $('.gas-avg-rate-text', rateEl).text('-');
    });
  }
}
