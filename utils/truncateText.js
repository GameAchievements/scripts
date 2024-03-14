export function truncateText(text, length) {
  if (text.length <= length) {
    return text;
  }

  //trim the string to the maximum length
  let trimmedString = text.substr(0, length);

  //re-trim if we are in the middle of a word
  trimmedString = trimmedString.substr(
    0,
    Math.min(trimmedString.length, trimmedString.lastIndexOf(' '))
  );

  return `${trimmedString} ...`;
}
