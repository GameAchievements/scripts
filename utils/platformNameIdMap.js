export const platformNameIdMap = (platformName) => {
  switch (platformName) {
    case 'playstation':
      return 1;
    case 'xbox':
      return 2;
    case 'steam':
    default:
      return 3;
  }
};
