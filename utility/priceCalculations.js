// vendor-web-app/utility/priceCalculations.js
export const mround = (value, multiple) => {
  return Math.round(value / multiple) * multiple;
};

export const floorToMultiple = (value, multiple) => {
  return Math.floor(value / multiple) * multiple;
};

export const ceiling = (value, multiple) => {
  return Math.ceil(value / multiple) * multiple;
};

export const roundToNearestNine = (value) => {
  return Math.ceil(value / 10) * 10 - 1;
};

export const calculatePrices = (asp, category) => {
  const aspNum = parseFloat(asp);
  
  let smallPrice, mediumPrice, largePrice;
  let smallCut, mediumCut, largeCut;

  if (category === "MEAL") {
    const aspAdj = aspNum * 1.2;

    smallPrice = mround(Math.round(aspAdj / 2.7), 10) - 1;
    mediumPrice = mround(Math.round((aspAdj / 3) * 1.85), 10) - 1;
    largePrice = mround(Math.round((aspAdj / 3) * 1.75 * 1.55), 10) - 1;

    const smallCutRaw = smallPrice * 0.2;
    smallCut = floorToMultiple(smallCutRaw, 2);

    const mediumCutRaw = mediumPrice * 0.2;
    const mediumCutRounded = floorToMultiple(mediumCutRaw, 2);
    mediumCut = Math.max(mediumCutRounded, smallCut + 5);

    const largeCutRaw = largePrice * 0.2;
    const largeCutRounded = floorToMultiple(largeCutRaw, 2);
    largeCut = Math.max(largeCutRounded, mediumCut + 5);
  } else {
    smallPrice = mround(Math.round(aspNum / 3), 10) - 1;
    mediumPrice = mround(Math.round((aspNum / 3) * 1.35), 10) - 1;
    largePrice = mround(Math.round((aspNum / 3) * 1.35 * 1.4), 10) - 1;

    const smallCutRaw = Math.floor((smallPrice * 0.2) * 100) / 100;
    smallCut = floorToMultiple(smallCutRaw, 2);

    const mediumCutRaw = Math.floor((mediumPrice * 0.2) * 100) / 100;
    const mediumCutRounded = floorToMultiple(mediumCutRaw, 2);
    mediumCut = Math.max(mediumCutRounded, smallCut + 5);

    const largeCutRaw = Math.floor((largePrice * 0.2) * 100) / 100;
    const largeCutRounded = floorToMultiple(largeCutRaw, 2);
    largeCut = Math.max(largeCutRounded, mediumCut + 5);
  }

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