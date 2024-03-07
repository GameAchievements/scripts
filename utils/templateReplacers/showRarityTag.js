export const showRarityTag = (percentageNumber, dataTemplateActual) => {
  const classValue = rarityClassCalc(percentageNumber);
  dataTemplateActual = dataTemplateActual.replaceAll(
    `{|rarity|}`,
    classValue.replace('-', ' ')
  );
  dataTemplateActual = $(`.gas-rarity-tag`, dataTemplateActual)
    .removeClass('gas-rarity-tag')
    .addClass(`gas-rarity-tag-${classValue}`)
    .children('.p1')
    .addClass(classValue)
    .parents('.gas-list-entry')
    .prop('outerHTML');
  return dataTemplateActual;
};
