import { listResponseHandler } from './ListHandler';

const apiDomain = document.querySelector('meta[name=domain]')?.content;

export const getPlatformId = () => {
  switch (window.location.pathname) {
    case '/playstation-leaderboard':
      return 1;
    case '/xbox-leaderboard':
      return 2;
    case '/steam-leaderboard':
      return 3;
    default:
      return;
  }
};

export async function fetchLeaderboard(elemId, searchTerm = '') {
  const paramsObj = {};
  if (getPlatformId()) {
    paramsObj.type = getPlatformId();
  }
  if (searchTerm.length) {
    paramsObj.q = searchTerm;
  }
  const resList = await fetch(
    `https://${apiDomain}/api/leaderboard${
      Object.keys(paramsObj)?.length
        ? `?${new URLSearchParams(paramsObj).toString()}`
        : ''
    }`
  );
  const resData = await resList.json();
  const numKeysToReplace = ['totalAchievements', 'gaPoints'];
  switch (getPlatformId()) {
    case 1:
      numKeysToReplace.push('silver', 'bronze', 'gold', 'platinum');
      break;
    case 2:
      numKeysToReplace.push('gamescore');
      break;
    case 3:
      numKeysToReplace.push('games');
      break;
  }
  listResponseHandler({
    listData: resData.results,
    elemId,
    numKeysToReplace,
    textKeysToReplace: ['profileId', 'name'],
  });
}
