import { gaTime, gaDate } from '../dateTIme';

export const showAchievementUnlocked = (
  userProgress,
  dataTemplateActual,
  parent = '.gh-row'
) => {
  const unlocked = userProgress?.unlocked;
  if (unlocked) {
    dataTemplateActual = dataTemplateActual.replaceAll(
      `{|unlockedAt|}`,
      `${gaTime(userProgress.unlockedAt)}<br />${gaDate(
        userProgress.unlockedAt
      )}`
    );
  }

  dataTemplateActual = $(`.status-wrapper`, dataTemplateActual)
    .children(`:not(.${unlocked ? 'unlocked' : 'locked'}-status)`)
    .hide()
    .parents(parent)
    .prop('outerHTML');

  return dataTemplateActual;
};
