// replaces standard double quotes by curvy ou single quotes to avoid elements attributes closing — since param can be a number (id), return it
export const cleanupDoubleQuotes = (content) =>
  content?.length
    ? content
        .replace(/"(\w)/g, '“$1')
        .replace(/(\w)"/g, '$1”')
        .replaceAll('"', "'")
    : content;
