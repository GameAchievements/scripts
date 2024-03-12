export const achievementNameSlicer = (name) => {
  // while achievements names have metadata (e.g. platform ids) for distinguishing purposes
  // this helps to take out that data
  if (!name) {
    return 'N.A.';
  }
  const metaDivider = name.lastIndexOf(' | ');
  return metaDivider > 0 ? name.slice(0, metaDivider) : name;
};
