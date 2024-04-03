import { platformNameIdMap } from '../../../utils';
import { loadVersionAchievements } from '../AchievementsSection';

const versionsDropdownId = '#gas-gh-versions-dropdown';

export async function versionSelectOption(e) {
  const $optSelected = $(e.target);
  $(`${versionsDropdownId}-options,${versionsDropdownId}-toggle`).removeClass(
    'w--open'
  );
  const selectedGameId = Number($optSelected.data('version-id'));
  const platformId = Number(
    platformNameIdMap($optSelected.data('platform')?.toLowerCase()) || 0
  );
  $(`${versionsDropdownId}-text-selected`).text($optSelected.text());
  loadVersionAchievements(selectedGameId, platformId);
}
