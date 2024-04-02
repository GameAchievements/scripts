export async function unlinkPlatform(
  { platform, accountId, accountName },
  fetchURLPrefix,
  platformsToLink,
  formMessageDelay
) {
  let platformsToLinkTemp = platformsToLink;
  const platformName = platform.toLowerCase();
  platformsToLinkTemp = platformsToLinkTemp.filter(
    (pTL) => pTL !== platformName
  );
  const $cardLinked = $(`#ga-pa-linked-${platformName}`);
  $('.gas-pa-name', $cardLinked)
    .text(accountId)
    .attr('title', `name: ${accountName}`);
  $cardLinked.show();
  $('.gas-unlink-pa-btn', $cardLinked).click(async (e) => {
    e.preventDefault();
    if (
      confirm(
        `Your ${platform} account will no longer belong to your profile. Are you sure?`
      )
    ) {
      await fetch(`${fetchURLPrefix}/unlink-pa`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform: platformNameIdMap(platformName),
        }),
      });
      $cardLinked.children().hide();
      $cardLinked
        .append(
          `<p id="ga-unlink-message" class="platform-heading">Unlinking your ${platformName} account…</p>`
        )
        .css({
          flexGrow: 1,
          maxWidth: '25%',
          justifyContent: 'center',
        });
      setTimeout(() => {
        $cardLinked.hide();
        $cardLinked.children().show();
        $('#ga-unlink-message', $cardLinked).remove();
        linkPlatform(platformName);
        sessionStorage.removeItem('prof');
        location.reload();
      }, formMessageDelay);
    }
  });
}
