import { listFetcher } from './utils/listFetcher';

export async function loadGames(elemIdPrefix, profileId, fetchURLPrefix) {
  await listFetcher(
    { elemIdPrefix, profileId, fetchURLPrefix },
    {
      listName: 'games',
      numKeysToReplace: [
        'id',
        'completion',
        'achievementsCount',
        'hoursPlayed',
      ],
      textKeysToReplace: ['name', 'description', 'updatedAt', 'playedAt'],
    }
  );
}
