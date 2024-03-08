import { listFetcher } from './utils/listFetcher';

export async function loadGuides(elemIdPrefix, gamehubURL) {
  await listFetcher(
    { elemIdPrefix, gamehubURL },
    {
      listName: 'guides',
      numKeysToReplace: ['id', 'commentsCount', 'viewsCount', 'likesCount'],
      textKeysToReplace: [
        'profileId',
        'name',
        'description',
        'author',
        'updatedAt',
      ],
    }
  );
}
