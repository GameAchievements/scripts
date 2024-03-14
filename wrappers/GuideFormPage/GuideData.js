import { detailsResponseHandler } from './utils/detailsResponseHandler';

export async function fetchGuide(apiDomain, guideId) {
  const resFetch = await fetch(`https://${apiDomain}/api/guide/${guideId}`);
  guideFetchedData = await resFetch.json();
  if (Object.keys(guideFetchedData).length > 0 && guideFetchedData.id) {
    document.title = `${
      guideFetchedData.name?.length
        ? guideFetchedData.name
        : guideFetchedData.id
    } | ${document.title}`;
    detailsResponseHandler(guideFetchedData);
    detailsResponseHandler(guideFetchedData, '#gas-guide-form');
  }

  return guideFetchedData;
}
