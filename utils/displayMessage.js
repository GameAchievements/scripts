export const displayMessage = (
  $msgEl,
  msgText,
  type = 'success',
  posAction = () => {}
) => {
  $msgEl.addClass(`${type}-message`).css('display', 'flex');
  $('div:first-child', $msgEl).text(msgText);
  setTimeout(() => {
    $msgEl.removeClass(`${type}-message`).hide();
    posAction();
  }, formMessageDelay);
};
