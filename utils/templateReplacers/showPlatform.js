export const showPlatform = (
  platformName,
  dataTemplateActual,
  parentSelector = '.gas-list-entry'
) => {
  let templateTemp = dataTemplateActual;
  const platformVerifier = {
    ps: { rgx: /playstation/gi },
    xbox: { rgx: /xbox/gi },
    steam: { rgx: /steam|pc|windows|mac|linux/gi },
  };
  if (platformVerifier.ps.rgx.test(platformName)) {
    templateTemp = $('.gas-platform-psn', templateTemp)
      .css('display', 'inherit')
      .parents(parentSelector)
      .prop('outerHTML');
  }
  if (platformVerifier.steam.rgx.test(platformName)) {
    templateTemp = $('.gas-platform-steam', templateTemp)
      .css('display', 'inherit')
      .parents(parentSelector)
      .prop('outerHTML');
  }
  if (platformVerifier.xbox.rgx.test(platformName)) {
    templateTemp = $('.gas-platform-xbox', templateTemp)
      .css('display', 'inherit')
      .parents(parentSelector)
      .prop('outerHTML');
  }
  return templateTemp;
};
