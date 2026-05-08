/**
 * Utility functions for working with Google Places API address components
 */

/** @returns {"11:00" | "23:00"-style string or null} */
function openingHoursPointToHHMM(pt) {
  if (!pt) return null;
  if (pt.time != null && pt.time !== "") {
    const s = String(pt.time).padStart(4, "0");
    return `${s.slice(0, 2)}:${s.slice(2, 4)}`;
  }
  if (typeof pt.hours === "number") {
    return `${String(pt.hours).padStart(2, "0")}:${String(pt.minutes ?? 0).padStart(2, "0")}`;
  }
  return null;
}

function fetchPlaceDetails(placeId) {
  if (
    typeof window === "undefined" ||
    !placeId ||
    !window.google?.maps?.places?.PlacesService
  ) {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    const svc = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );
    svc.getDetails(
      { placeId, fields: ["opening_hours"] },
      (result, status) => {
        resolve(
          status === window.google.maps.places.PlacesServiceStatus.OK
            ? result
            : null
        );
      }
    );
  });
}

/**
 * First period only: `opening_hours.periods[0].open` / `.close` → "11:00" / "23:00".
 * @returns {Promise<{ openTime: string, closeTime: string | null } | null>}
 */
export const resolveOpeningHoursForPlace = async (place) => {
  let oh = place?.opening_hours;
  if (!oh?.periods?.length && place?.place_id) {
    const details = await fetchPlaceDetails(place.place_id);
    oh = details?.opening_hours;
  }
  const p0 = oh?.periods?.[0];
  if (!p0?.open) return null;

  const openTime = openingHoursPointToHHMM(p0.open);
  if (!openTime) return null;

  const closeTime = p0.close ? openingHoursPointToHHMM(p0.close) : null;
  return { openTime, closeTime };
};

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

/**
 * Process a Google Places place object and extract vendor-related data
 * @param {Object} place - Google Places place object
 * @param {string} apiKey - Google Maps API key for generating embed URLs
 * @returns {Object|null} - Object containing processed place data or null if invalid place
 * @returns {string} returns.formattedAddress - Formatted address string
 * @returns {number} returns.latitude - Latitude coordinate
 * @returns {number} returns.longitude - Longitude coordinate
 * @returns {string} returns.serviceLocation - Formatted service location (LEVEL3, LEVEL1)
 * @returns {string} returns.mapEmbedUrl - Google Maps embed URL for iframe
 * @returns {string} returns.googleMapsUrl - Google Maps URL for sharing/navigation
 */
export const processPlaceForVendor = (place, apiKey) => {
  // Validate place object
  if (!place || !place.geometry || !place.formatted_address) {
    return null;
  }

  const formattedAddress = place.formatted_address;
  const latitude = place.geometry.location.lat();
  const longitude = place.geometry.location.lng();

  // Format service_location as uppercase(level3, level1)
  const serviceLocation = getServiceLocationFromAddressComponents(place.address_components);

  // Generate embed URL for iframe
  const mapEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${latitude},${longitude}&zoom=15`;

  // Generate Google Maps URL for address_url
  const googleMapsUrl = place.url || 
    `https://www.google.com/maps/place/${encodeURIComponent(formattedAddress)}/@${latitude},${longitude},15z`;

  return {
    formattedAddress,
    latitude,
    longitude,
    serviceLocation: serviceLocation || "",
    mapEmbedUrl,
    googleMapsUrl,
  };
};
