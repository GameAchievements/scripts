import { listTabFetcher } from './utils/listTabFetcher';

export async function loadAchievements(
  elemIdPrefix,
  profileId,
  fetchURLPrefix
) {
  await listTabFetcher(
    { elemIdPrefix, profileId, fetchURLPrefix },
    {
      listName: 'achievements',
      numKeysToReplace: ['id', 'score', 'achieversCount', 'gAPoints'],
      textKeysToReplace: ['name', 'description', 'updatedAt'],
    }
  );
}
