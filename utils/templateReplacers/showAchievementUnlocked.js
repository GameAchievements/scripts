import { gaTime, gaDate } from '../dateTIme';

export const showAchievementUnlocked = (
  userProgress,
  dataTemplateActual,
  parent = '.gh-row'
) => {
  let templateTemp = dataTemplateActual;
  const unlocked = userProgress?.unlocked;
  if (unlocked) {
    templateTemp = templateTemp.replaceAll(
      '{|unlockedAt|}',
      `${gaTime(userProgress.unlockedAt)}<br />${gaDate(
        userProgress.unlockedAt
      )}`
    );
  }

  templateTemp = $('.status-wrapper', templateTemp)
    .children(`:not(.${unlocked ? 'unlocked' : 'locked'}-status)`)
    .hide()
    .parents(parent)
    .prop('outerHTML');

  return templateTemp;
};
