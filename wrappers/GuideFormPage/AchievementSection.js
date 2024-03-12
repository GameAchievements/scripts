import { detailsResponseHandler } from './utils/detailsResponseHandler';

export async function fetchAchievement(apiDomain, achievementId) {
  const resFetch = await fetch(
    `https://${apiDomain}/api/achievement/${achievementId}`
  );
  const achievementFetchedData = await resFetch.json();
  if (
    Object.keys(achievementFetchedData).length > 0 &&
    achievementFetchedData.id
  ) {
    document.title = `Achievement ${
      achievementFetchedData.name?.length
        ? achievementFetchedData.name
        : achievementFetchedData.id
    } | ${document.title}`;
    achievementFetchedData.achievementName = achievementFetchedData.name;
    detailsResponseHandler(achievementFetchedData);
    detailsResponseHandler(achievementFetchedData, `#gas-guide-form`);
  }
}
