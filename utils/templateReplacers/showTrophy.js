export const showTrophy = (
  trophyType,
  dataTemplateActual,
  parent = '.gh-row'
) => {
  dataTemplateActual = $(`.trophy-wrapper`, dataTemplateActual)
    .children(`:not(.trophy-${trophyType.toLowerCase()})`)
    .hide()
    .parents(parent)
    .prop('outerHTML');

  return dataTemplateActual;
};
