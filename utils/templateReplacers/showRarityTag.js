export const showRarityTag = (percentageNumber, dataTemplateActual) => {
  let templateTemp = dataTemplateActual;
  const classValue = rarityClassCalc(percentageNumber);
  templateTemp = templateTemp.replaceAll(
    '{|rarity|}',
    classValue.replace('-', ' ')
  );
  templateTemp = $('.gas-rarity-tag', templateTemp)
    .removeClass('gas-rarity-tag')
    .addClass(`gas-rarity-tag-${classValue}`)
    .children('.p1')
    .addClass(classValue)
    .parents('.gas-list-entry')
    .prop('outerHTML');

  return templateTemp;
};
