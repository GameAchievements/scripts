import { achievementNameSlicer, gaDate } from '../../../utils';

export function detailsResponseHandler(res, elemId = '#gas-guide-details') {
  const $ghContainer = $(elemId);
  let dataTemplateActual = $ghContainer.prop('outerHTML');
  console.info(`=== ${elemId} ===`, res);
  const textKeysToReplace = [
    'id',
    'name',
    'achievementId',
    'achievementName',
    'gameId',
    'gameName',
  ];
  const guideImg = res.coverURL || res.imageURL;
  if (guideImg?.length && elemId.endsWith('details')) {
    dataTemplateActual = $ghContainer
      .css(
        'background-image',
        `linear-gradient(rgba(255,255,255,0),#030922),
          linear-gradient(rgba(70,89,255,.4),rgba(70,89,255,.4)),
          url(${guideImg})`
      )
      .prop('outerHTML');
  }
  for (const [key, value] of Object.entries(res)) {
    if (key === 'achievementName') {
      dataTemplateActual = dataTemplateActual.replaceAll(
        `{|${key}|}`,
        achievementNameSlicer(value)
      );
    } else if (textKeysToReplace.includes(key)) {
      dataTemplateActual = dataTemplateActual.replaceAll(
        `{|${key}|}`,
        (key.endsWith('At') ? gaDate(value) : value) || ''
      );
    }
  }
  $ghContainer.prop('outerHTML', dataTemplateActual);
}
