export const rarityClassCalc = (percent) => {
  if (percent < 25) {
    return 'common';
  }
  if (percent < 50) {
    return 'rare';
  }
  if (percent < 75) {
    return 'very-rare';
  }
  if (percent >= 75) {
    return 'ultra-rare';
  }
};

export const showRarityTagAchievement = (
  percentageNumber,
  dataTemplateActual,
  parent = '.hero-section-achievement'
) => {
  let templateTemp = dataTemplateActual;
  const classValue = rarityClassCalc(percentageNumber);

  templateTemp = $('.rarity-tag-wrapper', templateTemp)
    .children(`:not(.gas-rarity-tag-${classValue})`)
    .hide()
    .parents(parent)
    .prop('outerHTML');

  return templateTemp;
};
