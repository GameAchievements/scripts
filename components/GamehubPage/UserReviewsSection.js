import { listFetcher } from './utils/listFetcher';

export async function loadUserReviews(elemIdPrefix, gamehubURL) {
  listFetcher(
    { elemIdPrefix, gamehubURL },
    {
      listName: 'reviews',
      numKeysToReplace: ['id', 'likesCount'],
      textKeysToReplace: [
        'profileId',
        'name',
        'content',
        'author',
        'classification',
        'updatedAt',
      ],
      tabs: ['all', 'positive', 'mixed', 'negative'],
      tabMatcher: 'classification',
    }
  );
}
