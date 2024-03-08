import {
  cleanupDoubleQuotes,
  gaDate,
  isSteamImage,
  isXboxEdsImage,
  showImageFromSrc,
  showPlatform,
} from '../../utils';

const elemIdPrefix = `#gas-gh`;
const forumDomain = document.querySelector('meta[name=forum-domain]')?.content;

function listResponseHandlerHome(
  { gamehubData },
  { listData, elemId, numKeysToReplace, textKeysToReplace }
) {
  console.info(`=== ${elemId} results ===`, listData);
  let dataTemplate = $(elemId).prop('outerHTML');
  const $list = $(`${elemId} .gas-list`);
  const $emptyList = $(`${elemId} .gas-list-empty`);
  const $entryTemplate = $('.gas-list-entry', $list).first();
  $entryTemplate.show();
  dataTemplate = $entryTemplate.prop('outerHTML');
  $entryTemplate.hide();
  if (listData?.length && dataTemplate?.length) {
    $list.html($entryTemplate);
    listData.forEach((item, resIdx) => {
      let dataTemplateActual = dataTemplate;
      dataTemplateActual = dataTemplateActual.replaceAll(`{|idx|}`, resIdx + 1);
      Object.entries(item).forEach(([key, value]) => {
        if (item.gameIconURL?.length && !isSteamImage(item.gameIconURL)) {
          const $gameImg = $(`.gas-list-entry-cover-game`, dataTemplateActual);
          if ($gameImg?.length) {
            dataTemplateActual =
              showImageFromSrc($gameImg, item.gameIconURL) ||
              dataTemplateActual;
          }
        }
        if (
          (item.iconURL?.length || item.imageURL?.length) &&
          !isXboxEdsImage(item.imageURL) &&
          !isSteamImage(item.imageURL) &&
          !isSteamImage(item.iconURL)
        ) {
          const $entryImg = $(`.gas-list-entry-cover`, dataTemplateActual);
          if ($entryImg?.length) {
            dataTemplateActual = elemId.includes('list-games')
              ? $entryImg
                  .css('background-image', `url(${item.imageURL})`)
                  .parents('.gas-list-entry')
                  .prop('outerHTML')
              : showImageFromSrc($entryImg, item.iconURL || item.imageURL) ||
                dataTemplateActual;
          }
        }
        if (textKeysToReplace.includes(key)) {
          dataTemplateActual = dataTemplateActual.replaceAll(
            `{|${key}|}`,
            (key.endsWith('At') ? gaDate(value) : cleanupDoubleQuotes(value)) ||
              ''
          );
        } else if (numKeysToReplace.includes(key)) {
          dataTemplateActual = dataTemplateActual.replaceAll(
            `{|${key}|}`,
            Math.round(value || 0)
          );
        } else if (key === 'lastPlayed') {
          dataTemplateActual = dataTemplateActual.replaceAll(
            `{|${key}|}`,
            gaDate(value)
          );
        } else if (key === 'importedFromPlatform' || key === 'platform') {
          dataTemplateActual = showPlatform(value, dataTemplateActual);
        }
      });
      $list.append(dataTemplateActual);
    });
  } else {
    if (listData?.length && !dataTemplate?.length) {
      console.error(`${elemId} template issue (missing a '.gas-' class?)`);
    }

    let $emptyElem = $emptyList.children().first();
    let $emptyElemTemplate = $emptyElem
      .prop('outerHTML')
      .replaceAll('{|name|}', gamehubData.name);

    $emptyElem = $emptyElem.prop('outerHTML', $emptyElemTemplate);
    $(elemId).html($emptyList);
    $emptyList.show();
  }
  $list.css('display', 'flex');
}

export async function loadGameLatestThreads(gamehubData) {
  let listData = [];
  const elemId = `${elemIdPrefix}-forum-threads`;

  if (gamehubData.forumCategoryID) {
    const resFetch = await fetch(
      `https://${forumDomain}/api/category/${gamehubData.forumCategoryID}`
    );

    if (resFetch.ok) {
      const resData = (await resFetch.json()).topics;
      listData = resData.slice(0, 5);
    }

    listData = listData.map((e) => ({
      id: e.cid,
      title: e.title,
      topic_id: e.tid,
      author_name: e.user.username,
      imageURL: e.user.picture?.toLowerCase().includes('http')
        ? new DOMParser().parseFromString(e.user.picture, 'text/html')
            .documentElement.textContent
        : 'https://uploads-ssl.webflow.com/6455fdc10a7247f51c568c32/64b50ee999d75d5f75a28b08_user%20avatar%20default.svg',
      category_name: e.category.name,
      category_id: e.category.cid,
      views: e.viewcount,
      upvotes: e.upvotes,
      replies: e.postcount,
    }));
  }

  listResponseHandlerHome(
    { gamehubData },
    {
      listData,
      elemId,
      numKeysToReplace: ['replies', 'views', 'upvotes'],
      textKeysToReplace: [
        'title',
        'author_name',
        'category_name',
        'topic_id',
        'category_id',
      ],
    }
  );
  $(`${elemId} .ga-loader-container`).hide();
}
