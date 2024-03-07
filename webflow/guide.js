import {
  showPlatform,
  showImageFromSrc,
  gaDate,
  gaDateTime,
  achievementNameSlicer,
} from '../utils';

const apiDomain = document.querySelector('meta[name=domain]')?.content;
const urlParams = new URLSearchParams(location.search);
const guideId = urlParams.get('id') || 1;
let achievementId = 0;
let hasLike;
const elemIdPrefix = `#gas-guide`;

$('.ga-loader-container').show();
$('#ga-sections-container').hide();

// #gas-guide-comment-form

function loadSections(sections) {
  const $nav = $(`${elemIdPrefix}-nav`);
  const $secs = $(`${elemIdPrefix}-sections`);
  const $navTemp = $(`.gas-nav-btn`, $nav).first();
  const $secTemp = $(`.gas-section`, $secs).first();
  for (let secIdx = sections.length - 1; secIdx >= 0; secIdx--) {
    const sec = sections[secIdx];
    const $newNavBtn = $navTemp.clone();
    $newNavBtn.attr('title', sec.title);
    $newNavBtn
      .children()
      .first()
      .text($newNavBtn.text().replace(`{|title|}`, sec.title));
    const secNum = secIdx + 1;
    $nav.prepend($newNavBtn.attr('href', `${elemIdPrefix}-section-${secNum}`));
    const $newSec = $secTemp.clone();
    const $secTitle = $('.gas-section-title', $newSec);
    $secTitle.text(
      $secTitle.text().replace(`{|title|}`, `${secNum} › ${sec.title}`)
    );
    const $secContent = $('.gas-section-content', $newSec);
    $secContent.html($secContent.text().replace(`{|content|}`, sec.content));
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
  const $authorImg = $(`.gas-author-cover`, dataTemplateActual);
  if ($authorImg?.length && res.avatar?.length) {
    dataTemplateActual =
      showImageFromSrc($authorImg, res.avatar, elemId) || dataTemplateActual;
  }
  Object.entries(res).forEach(([key, value]) => {
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
  });
  $ghContainer.prop('outerHTML', dataTemplateActual);
  loadSections(res.sections);
}

async function fetchGuide() {
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

function listResponseHandler({ listData, elemId, textKeysToReplace }) {
  console.info(`=== ${elemId} results ===`, listData);
  let dataTemplate = $(elemId).prop('outerHTML');
  const $list = $(`${elemId} .gas-list`);
  const $emptyList = $(`.gas-list-empty`, $list);
  if (listData.count > 0 && listData.results?.length) {
    const $listHeader = $list.children().first();
    const $entryTemplate = $('.gas-list-entry', $list).first();
    $entryTemplate.show();
    dataTemplate = $entryTemplate.prop('outerHTML');
    $list.html($listHeader).append($entryTemplate);
    $entryTemplate.hide();
    listData.results.forEach((item, resIdx) => {
      let dataTemplateActual = dataTemplate;
      Object.entries(item).forEach(([key, value]) => {
        const $entryImg = $(`.gas-list-entry-cover`, dataTemplateActual);
        if ($entryImg.length && item.imageUrl?.length) {
          dataTemplateActual =
            showImageFromSrc($entryImg, item.imageURL) || dataTemplateActual;
        }
        if (textKeysToReplace.includes(key)) {
          dataTemplateActual = dataTemplateActual.replaceAll(
            `{|${key}|}`,
            value || ''
          );
        } else if (key === 'date') {
          const { date, time } = gaDateTime(value);
          dataTemplateActual = dataTemplateActual.replaceAll(
            `{|${key}|}`,
            `${date} at ${time}`
          );
        }
      });
      $list
        .append(dataTemplateActual)
        .children()
        .last()
        .removeClass(['bg-light', 'bg-dark'])
        .addClass(`bg-${resIdx % 2 > 0 ? 'light' : 'dark'}`);
    });
  } else {
    $list.html($emptyList);
    $emptyList.show();
  }
  $list.show();
}

async function listFetcher({ listName, textKeysToReplace }) {
  const elemId = `${elemIdPrefix}-${listName}`;
  const resList = await fetch(
    `https://${apiDomain}/api/guide/${guideId}/${listName}`
  );
  const listData = await resList.json();
  // global replacer
  $(`.gas-guide-${listName}-count`).text(listData.count || '');
  listResponseHandler({
    listData,
    elemId,
    textKeysToReplace,
  });
}

function setupLike(hasLikeFromFetch) {
  hasLike = hasLikeFromFetch;
  const $btnLike = $(`${elemIdPrefix}-btn-like`);
  const $btnDelLike = $(`${elemIdPrefix}-btn-like-del`);
  if (hasLike) {
    $btnLike.hide();
  } else {
    $btnDelLike.hide();
  }
  const changeLikeStatus = async () => {
    $btnLike.attr('disabled', true);
    $btnDelLike.attr('disabled', true);
    const resFetch = await fetch(
      `https://${apiDomain}/api/guide/${guideId}/upvote`,
      { method: 'POST', headers: { Authorization: `Bearer ${token}` } }
    );
    const $likesCount = $(`${elemIdPrefix}-upvotes-count`);
    const countChange = hasLike ? -1 : 1;
    hasLike = !hasLike;
    $likesCount.text(Number($likesCount.text() || 0) + countChange);
    if (resFetch.status === 204) {
      $btnLike.attr('disabled', false).show();
      $btnDelLike.hide();
      return;
    }
    $btnLike.hide();
    $btnDelLike.attr('disabled', false).show();
  };
  $btnLike.on('click', changeLikeStatus);
  $btnDelLike.on('click', changeLikeStatus);
}

const setupCommentForm = (hasComment) => {
  const formWrapperId = `${elemIdPrefix}-comment-form`;
  if (hasComment) {
    $(`${elemIdPrefix}-btn-add-comment`).hide();
    $(formWrapperId).parent().hide();
    return;
  }
  const formMessageDelay = 4000;
  const $submitBtn = $(`.submit-button`, formWrapperId);
  $submitBtn.attr('disabled', true);
  const $contentField = $(`[name=comment]`, formWrapperId);
  const submitText = $submitBtn.text();
  const $errEl = $('.gas-form-error', formWrapperId);
  const $errorDiv = $('div', $errEl);
  const txtError = $errEl.text();
  const $successEl = $('.gas-form-success', formWrapperId);
  $contentField.on('focusout keyup', function () {
    if (!$(this).val()?.length) {
      // only contentField required
      $(this).prev('label').addClass('field-label-missing');
      $submitBtn.addClass('disabled-button').attr('disabled', true);
    } else {
      $(this).prev('label').removeClass('field-label-missing');
      $submitBtn.removeClass('disabled-button').attr('disabled', false);
    }
  });
  $submitBtn.on('click', async (e) => {
    e.preventDefault();
    if (!$contentField.val().length) {
      $errEl.show();
      $errorDiv.text('Please write your comment in the box above');
      setTimeout(() => {
        $errEl.hide();
        $errorDiv.text(txtError);
      }, formMessageDelay);
      return;
    }
    // disable show popup on leave page (site-settings)
    isUserInputActive = false;
    $(`input`, formWrapperId).attr('disabled', true);
    $submitBtn.text($submitBtn.data('wait'));
    const resFetch = await fetch(
      `https://${apiDomain}/api/guide/${guideId}/comment`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment: $contentField.val() }),
      }
    );
    const revData = await resFetch.json();
    if (resFetch.status !== 201) {
      $errEl.show();
      $errorDiv.text(revData?.message);
      setTimeout(() => {
        $errEl.hide();
        $errorDiv.text(txtError);
        $(`input`, formWrapperId).attr('disabled', false);
        $submitBtn.text(submitText);
      }, formMessageDelay);
      return;
    }
    $(`form`, formWrapperId).hide();
    $successEl.attr('title', revData?.message).show();
    setTimeout(() => {
      location.reload();
    }, formMessageDelay);
  });
};

async function verifyAuthenticatedUserGuideData() {
  if (!token || !achievementId) {
    return;
  }
  const resFetch = await fetch(
    `https://${apiDomain}/api/achievement/${achievementId}/guide-auth-user-data?id=${guideId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (resFetch.status !== 200) {
    // auth user not found/issue, do not allow access to auth ops
    $(`${elemIdPrefix}-nav-auth`).hide();
    $(`${elemIdPrefix}-comment-form`).parent().hide();
    return;
  }
  const revData = await resFetch.json();
  const $editBtn = $(`${elemIdPrefix}-btn-edit`);
  if (revData.ownedGuideId > 0) {
    $editBtn.attr('href', `/guide-form?id=${revData.ownedGuideId}`).show();
  } else {
    $editBtn.hide();
  }
  setupLike(revData.hasLike);
  setupCommentForm(revData.hasComment);
}

$().ready(async () => {
  await auth0Bootstrap();
  if (await fetchGuide()) {
    await verifyAuthenticatedUserGuideData();
    await listFetcher({
      listName: 'comments',
      numKeysToReplace: [],
      textKeysToReplace: ['profileId', 'author', 'comment'],
    });
    $('.ga-loader-container').hide();
    $('#ga-sections-container').show();
    $('#gas-wf-tab-activator').click();
    return;
  }
  location.replace('/guides');
});
