// vendor-web-app/utility/priceCalculations.js
export const mround = (value, multiple) => {
  return Math.round(value / multiple) * multiple;
};

export const ceiling = (value, multiple) => {
  return Math.ceil(value / multiple) * multiple;
};

export const roundToNearestNine = (value) => {
  return Math.ceil(value / 10) * 10 - 1;
};

export const calculatePrices = (asp, category) => {
  const aspNum = parseFloat(asp);
  
  // For meals and baked goods, both use their own ASP
  if (!aspNum || aspNum <= 0) return null;

  // Common calculation for both MEALS and BAKED_GOODS
  // SMALL: MROUND( ROUND(ASP/3, 0), 10 ) - 1
  const smallPrice = mround(Math.round(aspNum / 3), 10) - 1;
  
  // MEDIUM: MROUND( ROUND(ASP/3 * 1.35, 0), 10 ) - 1
  const mediumPrice = mround(Math.round((aspNum / 3) * 1.35), 10) - 1;
  
  // LARGE: MROUND( ROUND(ASP/3 * 1.35 * 1.4, 0), 10 ) - 1
  const largePrice = mround(Math.round((aspNum / 3) * 1.35 * 1.4), 10) - 1;

  // SMALLCUT: Round down to nearest lower multiple of 2
  const smallCutRaw = Math.floor((smallPrice * 0.2) * 100) / 100;
  const smallCut = Math.floor(smallCutRaw / 2) * 2;
  
  // MEDIUMCUT: Round down to nearest lower multiple of 2, with minimum increment
  const mediumCutRaw = Math.floor((mediumPrice * 0.2) * 100) / 100;
  const mediumCutRounded = Math.floor(mediumCutRaw / 2) * 2;
  const mediumCut = Math.max(mediumCutRounded, smallCut + 5);
  
  // LARGECUT: Round down to nearest lower multiple of 2, with minimum increment
  const largeCutRaw = Math.floor((largePrice * 0.2) * 100) / 100;
  const largeCutRounded = Math.floor(largeCutRaw / 2) * 2;
  const largeCut = Math.max(largeCutRounded, mediumCut + 5);

  return {
    small: { price: smallPrice, cut: smallCut, serves: '1 person' },
    medium: { price: mediumPrice, cut: mediumCut, serves: '2-3 people' },
    large: { price: largePrice, cut: largeCut, serves: '3-5 people' }
  };
};

export const getTierInfo = (asp) => {
  const aspNum = parseFloat(asp);
  if (aspNum <= 150) return { name: 'BUDGET', color: 'bg-green-100 text-green-800' };
  if (aspNum <= 300) return { name: 'MID-TIER', color: 'bg-yellow-100 text-yellow-800' };
  return { name: 'PREMIUM', color: 'bg-purple-100 text-purple-800' };
};