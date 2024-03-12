import { listFetcher } from './utils/listFetcher';

export async function loadGuides(elemIdPrefix, profileId, fetchURLPrefix) {
  await listFetcher(
    { elemIdPrefix, profileId, fetchURLPrefix },
    {
      listName: 'guides',
      numKeysToReplace: ['commentsCount', 'viewsCount', 'likesCount'],
      textKeysToReplace: [
        'id',
        'profileId',
        'name',
        'achievementId',
        'achievementName',
        'achievementDescription',
        'updatedAt',
      ],
    }
  );
}
