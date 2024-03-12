import { listResponseHandler } from './utils/listResponseHandler';

const forumDomain = document.querySelector('meta[name=forum-domain]')?.content;

export async function fetchLatestThreads(elemIdPrefix) {
  const resFetch = await fetch(`https://${forumDomain}/api/recent`);
  let listData = [];
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
  const elemId = `${elemIdPrefix}-forum-threads`;
  listResponseHandler({
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
  });
  $(`${elemId} .ga-loader-container`).hide();
}
