// https://stackoverflow.com/a/7616484
export const generateHash = (content: string) => {
  let hash = 0;
  for (const char of content) {
    hash = (hash << 5) - hash + char.charCodeAt(0);
    hash |= 0;
  }
  return hash;
};
