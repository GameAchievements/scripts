import {
  listTemplateAppend,
  platformNameIdMap,
  showPlatform,
} from '../../utils';
import { loadVersionAchievements } from './AchievementsSection';
import { versionSelectOption } from './utils/versionSelectOption';

const elemIdPrefix = '#gas-gh';
const versionsDropdownId = '#gas-gh-versions-dropdown';

export async function versionsFetcher(gamehubData, gamehubURL) {
  const listName = 'versions';
  const elemId = `${elemIdPrefix}-${listName}`;
  if (!gamehubData.versionDetails) {
    const platform = gamehubData.platforms ?? gamehubData.importedFromPlatforms;
    const platformId = Number(
      platform?.length >= 1 ? platformNameIdMap(platform[0].toLowerCase()) : 0
    );
    $(versionsDropdownId).remove();
    return loadVersionAchievements(gamehubData.id, platformId);
  }

  const resLists = await fetch(`${gamehubURL}/${listName}`);
  const listData = await resLists.json();
  const numKeysToReplace = ['achievementsCount'];
  const textKeysToReplace = ['gameId', 'externalGameId', 'region'];
  console.info(`=== ${elemId} results ===`, listData);
  let dataTemplate = $(elemId).prop('outerHTML');
  const $list = $(`${elemId} .gas-list`);
  const $headerDesc = $(`${elemId} .heading-description-wrapper`)
    .children()
    .last();
  let $headerDescTemplate = $headerDesc.prop('outerHTML');

  if ($headerDescTemplate) {
    $headerDescTemplate = $headerDescTemplate.replaceAll(
      '{|name|}',
      gamehubData.name
    );
    $headerDesc.prop('outerHTML', $headerDescTemplate);
  }

  if (listData.length) {
    const $listHeader = $list.children().first();
    const $entryTemplate = $('.gas-list-entry', $list).first();
    $entryTemplate.show();
    dataTemplate = $entryTemplate.prop('outerHTML');
    $list.html($listHeader).append($entryTemplate);
    $entryTemplate.hide();

    // versions switching
    const versionOptClass = 'gas-version-option';
    const $selectOptTemplate = $(`${versionsDropdownId}-options`)
      .children()
      .first();
    $selectOptTemplate.addClass(versionOptClass);

    listData.forEach((item, itemIdx) => {
      optionRender($selectOptTemplate, item);
      if (item.achievementsGroups.length > 0) {
        for (const group of item.achievementsGroups) {
          optionRender($selectOptTemplate, item, group);
        }
      }
      let dataTemplateActual = dataTemplate;
      for (const [key, value] of Object.entries(item)) {
        if (textKeysToReplace.includes(key)) {
          dataTemplateActual = dataTemplateActual.replaceAll(
            `{|${key}|}`,
            value || '?'
          );
        } else if (numKeysToReplace.includes(key)) {
          dataTemplateActual = dataTemplateActual.replaceAll(
            `{|${key}|}`,
            Math.round(value || 0)
          );
        } else if (key === 'name') {
          dataTemplateActual = dataTemplateActual.replaceAll(
            `{|${key}|}`,
            // when the name is empty, identify by console & region
            item.name?.length ? item.name : versionOptionSuffix
          );
        } else if (key === 'platform') {
          dataTemplateActual = showPlatform(value, dataTemplateActual);
        } else if (key === 'consoles') {
          dataTemplateActual = $('.gas-console-tags', dataTemplateActual)
            .html(
              value.map((csl) => {
                const csli = csl.toLowerCase();
                return `<div class="console-${
                  csli.startsWith('ps') ? 'playstation' : csli.slice(0, 4)
                }">${csl}</div>`;
              })
            )
            .parents('.gas-list-entry')
            .prop('outerHTML');
        }
      }
      listTemplateAppend($list, dataTemplateActual, itemIdx);
    });
    $selectOptTemplate.remove();
    $(`.${versionOptClass}`).on('click', versionSelectOption);
  }
  $list.css('display', 'flex');
  $(`${elemId}-tab .gas-list-empty`).show();
  $(`${elemId},${elemId}-tab-btn`).css('display', 'flex');
}

function optionRender($selectOptTemplate, item, group) {
  const groupName = !group
    ? 'All'
    : group?.externalGroupId === 'default'
    ? 'Game Base'
    : group?.groupName;
  const $versionOpt = $selectOptTemplate.clone();
  const versionOptionSuffix =
    item.consoles[0] + (item.region ? ` — ${item.region} ` : '');
  $versionOpt
    .data('version-id', item.gameId)
    .data('version-external-id', item.externalGameId)
    .data('platform', item.platform)
    // append console & region to identify version option
    .text(
      `${item.name?.length ? `${item.name} | ` : ''}
          ${
            versionOptionSuffix ? `${versionOptionSuffix} | ` : ''
          } ${groupName}`
    );
  $(`${versionsDropdownId}-options`).append($versionOpt);
}
