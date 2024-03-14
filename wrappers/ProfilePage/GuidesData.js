import { listResponseHandler } from './utils/listResponseHandler';

export async function loadGuides(elemIdPrefix, profileId, fetchURLPrefix) {
  await listResponseHandler(
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
