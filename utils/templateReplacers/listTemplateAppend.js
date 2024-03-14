export const listTemplateAppend = (
  $list,
  dataTemplateActual,
  itemIdx,
  unlocked = false
) => {
  $list
    .append(dataTemplateActual)
    .children()
    .last()
    .removeClass(['bg-light', 'bg-dark', 'locked', 'unlocked'])
    .addClass(`bg-${itemIdx % 2 > 0 ? 'light' : 'dark'}`)
    .addClass(`${unlocked ? 'unlocked' : 'locked'}`);
};
