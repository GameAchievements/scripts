export async function verifyAuthenticatedUserGuideData(
  elemIdPrefix,
  token,
  apiDomain,
  achievementId
) {
  // hide edit button even with auth
  $(`${elemIdPrefix}-btn-guide-edit`).hide();
  if (!token) {
    return;
  }
  const resFetch = await fetch(
    `https://${apiDomain}/api/achievement/${achievementId}/guide-auth-user-data`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (resFetch.status !== 200) {
    return;
  }
  const revData = await resFetch.json();
  if (revData?.ownedGuideId > 0) {
    $(`${elemIdPrefix}-btn-guide-create`).hide();
    $(`${elemIdPrefix}-btn-guide-edit`)
      .attr('href', `/guide-form?id=${revData.ownedGuideId}`)
      .show();
  }
}
