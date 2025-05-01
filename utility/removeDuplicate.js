export const removeDuplicateWords = (address) => {
  const words = address.split(/,\s*|\s+/);
  const seen = new Set();
  const uniqueWords = [];

  for (const word of words) {
    const normalizedWord = word.toLowerCase().replace(/[-]/g, "");
    if (!seen.has(normalizedWord)) {
      seen.add(normalizedWord);
      uniqueWords.push(word);
    }
  }

  return uniqueWords.join(" ");
};
