import { ratingScale } from '../../utils';

// usage:
ratingScale($('.gas-rating-scale'), $('.gas-rating-selected'));

// on gas-form edition, prevent page navigation/close
let isUserInputActive = false;
$(window).on('beforeunload', (evt) => {
  if (isUserInputActive) {
    // Cancel the event as stated by the standard
    evt.preventDefault();
    // Chrome requires returnValue to be set
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    return (evt.returnValue = '');
  }
  // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
  return (evt.returnValue = undefined);
});
$('.gas-form').on('input', (evt) => {
  // any input containing text will prompt the user before leaving
  isUserInputActive = false;
  for (const inField of $('input:not([type=submit]),textarea', '.gas-form')) {
    const fieldVal = $(inField).val();
    if (fieldVal.length) {
      isUserInputActive = true;
      break;
    }
  }
});
