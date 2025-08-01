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
  
  if (category === 'SNACKS_AND_DESSERT') {
    return {
      small: { price: 39, cut: 5, serves: '1 person' },
      medium: { price: 59, cut: 10, serves: '2-3 people' },
      large: { price: 89, cut: 15, serves: '3-5 people' }
    };
  }

  // For meals and baked goods, both use their own ASP
  if (!aspNum || aspNum <= 0) return null;

  let basePrice, mediumMultiplier, largeMultiplier;
  
  if (category === 'BAKED_GOODS') {
    // For baked goods, use the same calculation as meals but with their own ASP
    basePrice = mround(Math.round(aspNum / 3), 10) - 1;
    mediumMultiplier = 1.35;
    largeMultiplier = 1.35 * 1.4;
    
    const mediumPrice = mround(Math.round(basePrice * mediumMultiplier), 10) - 1;
    const largePrice = mround(Math.round(basePrice * largeMultiplier), 10) - 1;

    // Calculate cuts
    const smallCut = ceiling(basePrice * 0.2, 5);
    const mediumCut = Math.max(ceiling(mediumPrice * 0.2, 5), smallCut + 5);
    const largeCut = Math.max(ceiling(largePrice * 0.2, 5), mediumCut + 5);

    return {
      small: { price: basePrice, cut: smallCut, serves: '1 person' },
      medium: { price: mediumPrice, cut: mediumCut, serves: '2-3 people' },
      large: { price: largePrice, cut: largeCut, serves: '3-5 people' }
    };
  } else {
    // For meals, use the original calculation
    basePrice = mround(Math.round(aspNum / 3), 10) - 1;
    mediumMultiplier = 1.35;
    largeMultiplier = 1.35 * 1.4;
    
    const mediumPrice = mround(Math.round(basePrice * mediumMultiplier), 10) - 1;
    const largePrice = mround(Math.round(basePrice * largeMultiplier), 10) - 1;

    // Calculate cuts
    const smallCut = ceiling(basePrice * 0.2, 5);
    const mediumCut = Math.max(ceiling(mediumPrice * 0.2, 5), smallCut + 5);
    const largeCut = Math.max(ceiling(largePrice * 0.2, 5), mediumCut + 5);

    return {
      small: { price: basePrice, cut: smallCut, serves: '1 person' },
      medium: { price: mediumPrice, cut: mediumCut, serves: '2-3 people' },
      large: { price: largePrice, cut: largeCut, serves: '3-5 people' }
    };
  }
};

export const getTierInfo = (asp) => {
  const aspNum = parseFloat(asp);
  if (aspNum <= 150) return { name: 'BUDGET', color: 'bg-green-100 text-green-800' };
  if (aspNum <= 300) return { name: 'MID-TIER', color: 'bg-yellow-100 text-yellow-800' };
  return { name: 'PREMIUM', color: 'bg-purple-100 text-purple-800' };
};