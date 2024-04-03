import { gaDate, gaTime, gaDateTime } from './dateTIme';
import { platformNameIdMap, platformNameShortMap } from './platformNameIdMap';
import { cleanupDoubleQuotes } from './cleanupDoubleQuotes';
import { truncateText } from './truncateText';
import { toTitleCase } from './toTitleCase';
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
import { showConsole } from './templateReplacers/showConsole';
import { showUserAchievements } from './templateReplacers/showUserAchievements';
import { showCompletion } from './templateReplacers/showCompletion';
import { showAchievementUnlocked } from './templateReplacers/showAchievementUnlocked';
import { showTrophy } from './templateReplacers/showTrophy';
import { showImageFromSrc } from './templateReplacers/showImageFromSrc';
import { showRarityTag } from './templateReplacers/showRarityTag';
import { setupListSearch } from './templateReplacers/setupListSearch';
import { ratingScale, ratingSVG } from './templateReplacers/ratingSVG';

export {
  truncateText,
  toTitleCase,
  gaDate,
  gaTime,
  gaDateTime,
  rarityClassCalc,
  platformNameIdMap,
  platformNameShortMap,
  cleanupDoubleQuotes,
  displayMessage,
  scrollToURLHash,
  isSteamImage,
  isXboxEdsImage,
  achievementNameSlicer,
  listTemplateAppend,
  showPlatform,
  showConsole,
  showUserAchievements,
  showRarityTagAchievement,
  showAchievementUnlocked,
  showCompletion,
  showTrophy,
  showImageFromSrc,
  showRarityTag,
  setupListSearch,
  ratingScale,
  ratingSVG,
};
