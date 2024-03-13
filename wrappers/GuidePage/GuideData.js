import {
  achievementNameSlicer,
  gaDate,
  showImageFromSrc,
  showPlatform,
} from '../../utils';

const elemIdPrefix = '#gas-guide';

function loadSections(sections) {
  const $nav = $(`${elemIdPrefix}-nav`);
  const $secs = $(`${elemIdPrefix}-sections`);
  const $navTemp = $('.gas-nav-btn', $nav).first();
  const $secTemp = $('.gas-section', $secs).first();
  for (let secIdx = sections.length - 1; secIdx >= 0; secIdx--) {
    const sec = sections[secIdx];
    const $newNavBtn = $navTemp.clone();
    $newNavBtn.attr('title', sec.title);
    $newNavBtn
      .children()
      .first()
      .text($newNavBtn.text().replace('{|title|}', sec.title));
    const secNum = secIdx + 1;
    $nav.prepend($newNavBtn.attr('href', `${elemIdPrefix}-section-${secNum}`));
    const $newSec = $secTemp.clone();
    const $secTitle = $('.gas-section-title', $newSec);
    $secTitle.text(
      $secTitle.text().replace('{|title|}', `${secNum} › ${sec.title}`)
    );
    const $secContent = $('.gas-section-content', $newSec);
    $secContent.html($secContent.text().replace('{|content|}', sec.content));
    $secs.prepend(
      $newSec.attr('id', `${elemIdPrefix.slice(1)}-section-${secNum}`)
    );
  }
  $navTemp.remove();
  $secTemp.remove();
}

function guideResponseHandler(res) {
  const elemId = `${elemIdPrefix}-details`;
  const $ghContainer = $(elemId);
  let dataTemplateActual = $ghContainer.prop('outerHTML');
  console.info(`=== ${elemId} ===`, res);
  const textKeysToReplace = [
    'id',
    'name',
    'description',
    'achievementId',
    'achievementName',
    'gameId',
    'gameName',
    'profileId',
    'author',
    'createdAt',
    'updatedAt',
  ];
  const numKeysToReplace = ['comments', 'upvotes'];
  const guideImg = res.coverURL || res.imageURL;
  if (guideImg?.length) {
    dataTemplateActual = $ghContainer
      .css(
        'background-image',
        `linear-gradient(rgba(255,255,255,0),#030922),
          linear-gradient(rgba(70,89,255,.4),rgba(70,89,255,.4)),
          url(${guideImg})`
      )
      .prop('outerHTML');
  }
  const $authorImg = $('.gas-author-cover', dataTemplateActual);
  if ($authorImg?.length && res.avatar?.length) {
    dataTemplateActual =
      showImageFromSrc($authorImg, res.avatar, elemId) || dataTemplateActual;
  }
  for (const [key, value] of Object.entries(res)) {
    if (textKeysToReplace.includes(key)) {
      dataTemplateActual = dataTemplateActual.replaceAll(
        `{|${key}|}`,
        (key.endsWith('At') ? gaDate(value) : value) || ''
      );
    } else if (numKeysToReplace.includes(key)) {
      dataTemplateActual = dataTemplateActual.replaceAll(
        `{|${key}|}`,
        Math.round(value || 0)
      );
    } else if (key === 'platform') {
      dataTemplateActual = showPlatform(value, dataTemplateActual, elemId);
    }
  }
  $ghContainer.prop('outerHTML', dataTemplateActual);
  loadSections(res.sections);
}

export async function fetchGuide(apiDomain, guideId) {
  const resFetch = await fetch(`https://${apiDomain}/api/guide/${guideId}`);
  if (resFetch.status !== 200) {
    return;
  }
  const resData = await resFetch.json();
  if (Object.keys(resData).length > 0 && resData.id) {
    document.title = `${resData.name?.length ? resData.name : resData.id} | ${
      document.title
    }`;
    achievementId = resData.achievementId;
    resData.achievementName = achievementNameSlicer(resData.achievementName);
    guideResponseHandler(resData);
  }
  return resData;
}
