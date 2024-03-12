import { listFetcher } from './utils/listFetcher';

export async function loadReviews(elemIdPrefix, profileId, fetchURLPrefix) {
  await listFetcher(
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
