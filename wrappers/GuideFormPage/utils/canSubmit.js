const isRequiredFilled = ($el, hasLen) => {
  if (hasLen) {
    isUserInputActive = true;
    return true;
  }
  return false;
};

const highlightRequiredLabel = ($el) => {
  if (
    ($el.hasClass('gas-form-tinymce')
      ? tinyMCE.get($el.attr('id')).getContent()
      : $el.val()
    )?.length
  ) {
    return $el.prev('label').removeClass('field-label-missing');
  }
  $el.prev('label').addClass('field-label-missing');
};

// cycle all fields and verify if they all have content
export function canSubmit($elChanged, elemId = '#gas-guide-form') {
  let allInputsFilled = false;
  let allTextareasFilled = false;
  if ($elChanged?.length) {
    highlightRequiredLabel($elChanged);
  }
  for (const inp of $('input[name][required]', elemId)) {
    allInputsFilled = isRequiredFilled($(inp), $(inp).val()?.length);
    if (!allInputsFilled) {
      break;
    }
  }
  for (const txt of $('.gas-form-tinymce', elemId)) {
    allTextareasFilled = isRequiredFilled(
      $(txt),
      tinyMCE.get($(txt).attr('id')).getContent()?.length
    );
    if (!allTextareasFilled) {
      break;
    }
  }
  if (allInputsFilled && allTextareasFilled) {
    $(`${elemId}-btn-submit`)
      .removeClass('disabled-button')
      .attr('disabled', false);
  } else {
    $(`${elemId}-btn-submit`)
      .addClass('disabled-button')
      .attr('disabled', true);
  }
}
