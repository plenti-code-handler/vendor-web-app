/**
 * Utility functions for working with Google Places API address components
 */

/**
 * Extract administrative area level from address components
 * @param {Array} addressComponents - Array of address components from Google Places
 * @param {number} level - Administrative area level (1, 2, 3, etc.)
 * @returns {string|null} - The long name of the administrative area, or null if not found
 */
export const getAdministrativeArea = (addressComponents, level) => {
  if (!addressComponents || !Array.isArray(addressComponents)) {
    return null;
  }
  
  const component = addressComponents.find(component => 
    component.types && component.types.includes(`administrative_area_level_${level}`)
  );
  
  return component ? component.long_name : null;
};

/**
 * Format service location from administrative area levels
 * Format: UPPERCASE(level3, level1)
 * @param {string|null} level3 - Administrative area level 3 (city/district)
 * @param {string|null} level1 - Administrative area level 1 (state)
 * @returns {string|null} - Formatted service location string or null
 */
export const formatServiceLocation = (level3, level1) => {
  const parts = [level3, level1].filter(Boolean);
  return parts.length > 0 ? parts.join(', ').toUpperCase() : null;
};

/**
 * Extract and format service location from Google Places address components
 * @param {Array} addressComponents - Array of address components from Google Places
 * @returns {string|null} - Formatted service location string or null
 */
export const getServiceLocationFromAddressComponents = (addressComponents) => {
  const level3 = getAdministrativeArea(addressComponents, 3);
  const level1 = getAdministrativeArea(addressComponents, 1);
  return formatServiceLocation(level3, level1);
};
