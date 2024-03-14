export const platformNameIdMap = (platformName) => {
  switch (platformName) {
    case 'playstation':
      return 1;
    case 'xbox':
      return 2;
    // case 'steam':
    default:
      return 3;
  }
};

export const platformNameShortMap = (platformName) => {
  switch (platformName.toLowerCase()) {
    case 'playstation':
      return 'psn';
    case 'xbox':
      return 'xbox';
    case 'steam':
      return 'steam';
    default:
      return 'ga';
  }
};
