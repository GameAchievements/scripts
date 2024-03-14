export const displayMessage = (
  $msgEl,
  msgText,
  type = 'success',
  posAction = () => {},
  formMessageDelay = 4e3
) => {
  $msgEl.addClass(`${type}-message`).css('display', 'flex');
  $('div:first-child', $msgEl).text(msgText);
  setTimeout(() => {
    $msgEl.removeClass(`${type}-message`).hide();
    posAction();
  }, formMessageDelay);
};
