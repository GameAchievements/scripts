import { gaDate, gaTime, gaDateTime } from './dateTIme';
import { platformNameIdMap } from './platformNameIdMap';
import { cleanupDoubleQuotes } from './cleanupDoubleQuotes';
import { displayMessage } from './displayMessage';
import { scrollToURLHash } from './scrollToURLHash';
import { isSteamImage, isXboxEdsImage } from './checkImageType';
import { achievementNameSlicer } from './achievementNameSlicer';

import {
  showRarityTagAchievement,
  rarityClassCalc,
} from './templateReplacers/showRarityTagAchievement';
import { listTemplateAppend } from './templateReplacers/listTemplateAppend';
import { showPlatform } from './templateReplacers/showPlatform';
import { showAchievementUnlocked } from './templateReplacers/showAchievementUnlocked';
import { showTrophy } from './templateReplacers/showTrophy';
import { showImageFromSrc } from './templateReplacers/showImageFromSrc';
import { showRarityTag } from './templateReplacers/showRarityTag';
import { setupListSearch } from './templateReplacers/setupListSearch';
import { ratingScale, ratingSVG } from './templateReplacers/ratingSVG';

export {
  gaDate,
  gaTime,
  gaDateTime,
  rarityClassCalc,
  platformNameIdMap,
  cleanupDoubleQuotes,
  displayMessage,
  scrollToURLHash,
  isSteamImage,
  isXboxEdsImage,
  achievementNameSlicer,
  listTemplateAppend,
  showPlatform,
  showRarityTagAchievement,
  showAchievementUnlocked,
  showTrophy,
  showImageFromSrc,
  showRarityTag,
  setupListSearch,
  ratingScale,
  ratingSVG,
};
