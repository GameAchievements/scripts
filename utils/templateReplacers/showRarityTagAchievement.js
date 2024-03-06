export const rarityClassCalc = (percent) => {
  if (percent < 25) {
    return 'common';
  } else if (percent < 50) {
    return 'rare';
  } else if (percent < 75) {
    return 'very-rare';
  } else if (percent >= 75) {
    return 'ultra-rare';
  }
};

export const showRarityTagAchievement = (
  percentageNumber,
  dataTemplateActual,
  parent = '.hero-section-achievement'
) => {
  const classValue = rarityClassCalc(percentageNumber);

  dataTemplateActual = $(`.rarity-tag-wrapper`, dataTemplateActual)
    .children(`:not(.gas-rarity-tag-${classValue})`)
    .hide()
    .parents(parent)
    .prop('outerHTML');

  return dataTemplateActual;
};
