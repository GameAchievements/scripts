import { showImageFromSrc, showPlatform, gaDate } from '../../utils';

const elemIdPrefix = `#gas-gh`;

function gamehubResponseHandler(res, elemId) {
  const $ghContainer = $(elemId);
  let dataTemplateActual = $ghContainer.prop('outerHTML');
  console.info(`=== ${elemId} ===`, res);
  // top section keys to replace
  const textTopKeysToReplace = ['name', 'igdbId', 'description'];
  const numTopKeysToReplace = [
    'ownersCount', //label: players
    'achievementsCount', //label: total achievements
    'gaReviewScore', //label: GA score
    'versionsCount', //label: game versions
    'completion', //label: average completion
  ];

  // about section keys to replace
  const textAboutKeysToReplace = ['releaseDate'];
  const numAboutKeysToReplace = [];
  const keysWithArrays = [
    'developers',
    'publishers',
    'franchises',
    'engines',
    'modes',
    'genres',
    'themes',
    'series',
    'supportedLanguages',
    'playerPerspectives',
  ];

  //join section arrays
  const textKeysToReplace = [
    ...textTopKeysToReplace,
    ...textAboutKeysToReplace,
  ];
  const numKeysToReplace = [...numTopKeysToReplace, ...numAboutKeysToReplace];

  if (elemId.endsWith('top') && (res.coverURL || res.imageURL)?.length) {
    dataTemplateActual = $ghContainer
      .css(
        'background-image',
        `linear-gradient(rgba(255,255,255,0),#030922),
          linear-gradient(rgba(70,89,255,.4),rgba(70,89,255,.4)),
          url(${res.coverURL || res.imageURL})`
      )
      .prop('outerHTML');
  }
  $('.gas-img', dataTemplateActual).each((idx, elm) => {
    if (res.imageURL?.length) {
      dataTemplateActual =
        showImageFromSrc($(elm), res.imageURL, elemId) || dataTemplateActual;
    }
  });
  Object.entries(res).forEach(([key, value]) => {
    if (
      textKeysToReplace.find((el) => el.toLowerCase() === key.toLowerCase())
    ) {
      dataTemplateActual = dataTemplateActual.replaceAll(
        `{|${key}|}`,
        value?.length ? (key.endsWith('Date') ? gaDate(value) : value) : 'N.A.'
      );
    } else if (
      numKeysToReplace.find((el) => el.toLowerCase() === key.toLowerCase())
    ) {
      dataTemplateActual = dataTemplateActual.replaceAll(
        `{|${key}|}`,
        Math.round(value || 0)
      );
    } else if (key === 'platformsInGACount' && elemId.endsWith('top')) {
      dataTemplateActual = showPlatform(
        value?.length ? value : res['importedFromPlatforms'],
        dataTemplateActual,
        elemId
      );
    } else if (keysWithArrays.includes(key)) {
      dataTemplateActual = dataTemplateActual.replaceAll(
        `{|${key}|}`,
        value?.length ? value.join(', ') : 'N.A.'
      );
    }
  });
  $ghContainer.prop('outerHTML', dataTemplateActual);

  const resKeys = Object.keys(res);
  const emptyElems = [
    ...numTopKeysToReplace,
    ...textKeysToReplace,
    ...keysWithArrays,
  ].filter((el) => !resKeys.includes(el));

  emptyElems.forEach((el) => {
    $(`div:contains({|${el}|})`).parent('.entry-wrapper').remove();
  });

  if (elemId.endsWith('about') && emptyElems.length > 0) {
    $('.about-game-entry-div').each(function () {
      if ($(this).find('.entry-wrapper').length === 0) {
        $(this).remove();
      }
    });
  }
}

export async function fetchGamehub(gamehubURL, gameId) {
  const resFetch = await fetch(gamehubURL);
  if (!resFetch.ok) {
    location.replace('/games');
    return;
  }
  const resData = await resFetch.json();
  if (Object.keys(resData).length > 0 && resData.id) {
    if (
      resData.versionDetails &&
      resData.versionDetails.defaultVersion !== Number(gameId)
    ) {
      // redirect to the default game version
      location.replace(`/game?id=${resData.versionDetails.defaultVersion}`);
      return;
    }
    document.title = `${resData.name?.length ? resData.name : resData.id} | ${
      document.title
    }`;
    if (resData.igdbId?.length) {
      ['top', 'about'].forEach((elemIdSuf) => {
        gamehubResponseHandler(resData, `${elemIdPrefix}-${elemIdSuf}`);
      });
    } else {
      $(
        `${elemIdPrefix}-about,${elemIdPrefix}-igdb-id,[href="${elemIdPrefix}-about"]`
      ).remove();
      gamehubResponseHandler(resData, `${elemIdPrefix}-top`);
    }
  }
  return resData;
}
