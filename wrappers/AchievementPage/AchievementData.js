import {
  showImageFromSrc,
  showPlatform,
  showRarityTagAchievement,
} from '../../utils';

function achievementResponseHandler(elemIdPrefix, res) {
  const elemId = `${elemIdPrefix}-details`;
  const $ghContainer = $(elemId);
  let dataTemplateActual = $ghContainer.prop('outerHTML');
  console.info(`=== ${elemId} ===`, res);
  const textKeysToReplace = ['id', 'name', 'description', 'gameId', 'gameName'];
  const numKeysToReplace = [
    'achievers',
    'completionPercentage',
    'guides',
    'gaPoints',
  ];
  const achievementImg = res.coverURL || res.imageURL || res.gameImageURL;
  if (achievementImg?.length) {
    dataTemplateActual = $ghContainer
      .css(
        'background-image',
        `linear-gradient(rgba(255,255,255,0),#030922),
          linear-gradient(rgba(70,89,255,.4),rgba(70,89,255,.4)),
          url(${achievementImg})`
      )
      .prop('outerHTML');
  }
  $('.achievement-main-img', dataTemplateActual).each((idx, elm) => {
    if (res.imageURL?.length) {
      dataTemplateActual =
        showImageFromSrc($(elm), res.imageURL, elemId) || dataTemplateActual;
    }
  });

  for (const [key, value] of Object.entries(res)) {
    if (textKeysToReplace.includes(key)) {
      dataTemplateActual = dataTemplateActual.replaceAll(`{|${key}|}`, value);
    } else if (numKeysToReplace.includes(key)) {
      dataTemplateActual = dataTemplateActual.replaceAll(
        `{|${key}|}`,
        Math.round(value || 0)
      );
    } else if (key === 'platform') {
      dataTemplateActual = showPlatform(value, dataTemplateActual, elemId);
    } else if (key === 'rarity') {
      dataTemplateActual = showRarityTagAchievement(value, dataTemplateActual);
    }
  }

  $ghContainer.prop('outerHTML', dataTemplateActual);
}

export async function fetchAchievement(elemIdPrefix, apiDomain, achievementId) {
  const resFetch = await fetch(
    `https://${apiDomain}/api/achievement/${achievementId}`
  );
  if (resFetch.status !== 200) {
    return;
  }
  const resData = await resFetch.json();
  if (Object.keys(resData).length > 0 && resData.id) {
    document.title = `${resData.name?.length ? resData.name : resData.id} | ${
      document.title
    }`;
    achievementResponseHandler(elemIdPrefix, resData);
  }
  return resData;
}
