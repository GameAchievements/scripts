export const showTrophy = (
  trophyType,
  dataTemplateActual,
  parent = '.gh-row'
) => {
  let templateTemp = dataTemplateActual;
  templateTemp = $('.trophy-wrapper', templateTemp)
    .children(`:not(.trophy-${trophyType.toLowerCase()})`)
    .hide()
    .parents(parent)
    .prop('outerHTML');

  return templateTemp;
};
