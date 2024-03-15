export const showCompletion = (
  completionPercentage,
  dataTemplateActual,
  parent = '.gh-row'
) => {
  let templateTemp = dataTemplateActual;
  templateTemp = $('.completion-status-wrapper', templateTemp)
    .children(
      `:not(.${completionPercentage === 100 ? 'unlocked' : 'locked'}-status)`
    )
    .hide()
    .parents(parent)
    .prop('outerHTML');

  templateTemp = templateTemp.replaceAll(
    '{|completion|}',
    Math.round(completionPercentage || 0)
  );

  return templateTemp;
};
