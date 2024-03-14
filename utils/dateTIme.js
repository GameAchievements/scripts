export const gaDate = (isoDate) => {
  const pad = (v) => `0${v}`.slice(-2);
  const dateObj = new Date(isoDate);
  return `${dateObj.getFullYear()} . ${pad(dateObj.getMonth() + 1)} . ${pad(
    dateObj.getDate()
  )}`;
};

export const gaTime = (isoDate) => {
  const pad = (v) => `0${v}`.slice(-2);
  const dateObj = new Date(isoDate);

  return `${pad(dateObj.getHours())}h${pad(dateObj.getMinutes())}`;
};

export const gaDateTime = (isoDate) => {
  const dateObj = new Date(isoDate);
  const month = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const date = `${dateObj.getDate()} ${
    month[dateObj.getMonth()]
  }, ${dateObj.getFullYear()}`;
  const time = dateObj.toLocaleTimeString().toLowerCase();
  return { date, time };
};
