import { listFetcher } from './utils/listFetcher';

export async function loadAchievements(
  elemIdPrefix,
  profileId,
  fetchURLPrefix
) {
  await listFetcher(
    { elemIdPrefix, profileId, fetchURLPrefix },
    {
      listName: 'achievements',
      numKeysToReplace: ['id', 'score', 'achieversCount', 'gAPoints'],
      textKeysToReplace: ['name', 'description', 'updatedAt'],
    }
  );
}
