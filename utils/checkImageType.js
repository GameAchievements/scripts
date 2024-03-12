export const isSteamImage = (imgURL) =>
  imgURL?.includes('steamstatic') || imgURL?.includes('steampowered');

export const isXboxEdsImage = (imgURL) =>
  imgURL?.includes('images-eds.xboxlive.com');
