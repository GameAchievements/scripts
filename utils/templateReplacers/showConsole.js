export const showConsole = (
  consoleName,
  dataTemplateActual,
  parentSelector = '.gas-list-entry'
) => {
  let templateTemp = dataTemplateActual;
  const platformVerifier = {
    ps: { rgx: /ps/gi },
    xbox: { rgx: /xbox/gi },
    pc: { rgx: /steam|pc|windows|mac|linux/gi },
  };
  if (platformVerifier.ps.rgx.test(consoleName)) {
    templateTemp = $('.gas-console-tags', templateTemp)
      .children(':not(.console-playstation)')
      .hide()
      .parents(parentSelector)
      .prop('outerHTML');
    templateTemp = templateTemp.replaceAll('PS5', consoleName);
  } else if (platformVerifier.pc.rgx.test(consoleName)) {
    templateTemp = $('.gas-console-tags', templateTemp)
      .children(':not(.console-pc)')
      .hide()
      .parents(parentSelector)
      .prop('outerHTML');
    templateTemp = templateTemp.replaceAll('PC', consoleName);
  } else if (platformVerifier.xbox.rgx.test(consoleName)) {
    templateTemp = $('.gas-console-tags', templateTemp)
      .children(':not(.console-xbox)')
      .hide()
      .parents(parentSelector)
      .prop('outerHTML');
    templateTemp = templateTemp.replaceAll('XBOX 360', consoleName);
  }

  return templateTemp;
};
