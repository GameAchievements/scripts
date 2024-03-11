export async function homeMetricsHandler(apiDomain) {
  const resFetch = await fetch(`https://${apiDomain}/api/game/stats`);
  const resData = await resFetch.json();

  const $ghContainer = $('#top-page');
  let dataTemplateActual = $ghContainer.prop('outerHTML');

  console.info(`=== #top-page ===`, resData);

  const numKeysToReplace = [
    'registeredUsers', //label: registered gamers
    'gamesTracked', //label: games tracked
    'achievementsTracked', //label: achievements tracked
    'achievementsUnlocked', //label: achievements unlocked
    'forumPosts', //label: forum posts
  ];

  Object.entries(resData).forEach(([key, value]) => {
    if (numKeysToReplace.find((el) => el.toLowerCase() === key.toLowerCase())) {
      dataTemplateActual = dataTemplateActual.replaceAll(
        `{|${key}|}`,
        Math.round(value || 0)
      );
    }
  });
  $ghContainer.prop('outerHTML', dataTemplateActual);
}
