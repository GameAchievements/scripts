import { displayMessage } from '../../utils';

export async function deleteProfile() {
  if (
    confirm(
      'This will unlink all your platforms from your profile and remove your profile. Are you sure?'
    )
  ) {
    const fetchURL = `https://${apiDomain}/api/user`;
    const resFetch = await fetch(fetchURL, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const $msgEl = $(`${elemIdPrefix}-msg-delete`);
    $(this).hide();
    if (resFetch.status !== 204) {
      displayMessage(
        $msgEl,
        'Account could not be deleted… Please try later.',
        'error',
        () => {
          $(this).show();
        }
      );
      return;
    }
    displayMessage(
      $msgEl,
      'Account is successfully being deleted… Logging out.',
      'success',
      logout
    );
  }
}
