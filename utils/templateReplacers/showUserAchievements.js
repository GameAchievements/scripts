export const showUserAchievements = (
  achievements,
  dataTemplateActual,
  parent = '.gh-row'
) => {
  let templateTemp = dataTemplateActual;
  templateTemp = $('.total-achievements-wrapper', templateTemp)
    .children(
      `:not(.total-achievements-${
        achievements.userAchievementsCount === achievements.achievementsCount
          ? 'completed'
          : 'uncompleted'
      })`
    )
    .hide()
    .parents(parent)
    .prop('outerHTML');

  templateTemp = templateTemp.replaceAll(
    '{|userAchievementsCount|}/{|achievementsCount|}',
    `${Math.round(achievements.userAchievementsCount || 0)}/${Math.round(
      achievements.achievementsCount || 0
    )}`
  );

  return templateTemp;
};
