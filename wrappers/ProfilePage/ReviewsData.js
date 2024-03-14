import { listResponseHandler } from './utils/listResponseHandler';

export async function loadReviews(elemIdPrefix, profileId, fetchURLPrefix) {
  await listResponseHandler(
    { elemIdPrefix, profileId, fetchURLPrefix },
    {
      listName: 'reviews',
      numKeysToReplace: ['id', 'likesCount', 'gameId'],
      textKeysToReplace: [
        'profileId',
        'name',
        'content',
        'gameName',
        'classification',
        'updatedAt',
      ],
      tabs: ['all', 'positive', 'mixed', 'negative'],
      tabMatcher: 'classification',
    }
  );
}
