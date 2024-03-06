export const showPlatform = (
  platformName,
  dataTemplateActual,
  parentSelector = '.gas-list-entry'
) => {
  const platformVerifier = {
    ps: { rgx: /playstation/gi },
    xbox: { rgx: /xbox/gi },
    steam: { rgx: /steam|pc|windows|mac|linux/gi },
  };
  if (platformVerifier.ps.rgx.test(platformName)) {
    dataTemplateActual = $(`.gas-platform-psn`, dataTemplateActual)
      .css('display', 'inherit')
      .parents(parentSelector)
      .prop('outerHTML');
  }
  if (platformVerifier.steam.rgx.test(platformName)) {
    dataTemplateActual = $(`.gas-platform-steam`, dataTemplateActual)
      .css('display', 'inherit')
      .parents(parentSelector)
      .prop('outerHTML');
  }
  if (platformVerifier.xbox.rgx.test(platformName)) {
    dataTemplateActual = $(`.gas-platform-xbox`, dataTemplateActual)
      .css('display', 'inherit')
      .parents(parentSelector)
      .prop('outerHTML');
  }
  return dataTemplateActual;
};
