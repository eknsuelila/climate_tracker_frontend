/**
 * Loads and processes BC Regional Districts GeoJSON data
 */

let geojsonCache = null;
let loadingPromise = null;

/**
 * Load the regional districts GeoJSON file
 * @returns {Promise<Object>} GeoJSON FeatureCollection
 */
export async function loadRegionalDistrictsGeoJSON() {
  // Return cached data if available
  if (geojsonCache) {
    return geojsonCache;
  }

  // If already loading, return the existing promise
  if (loadingPromise) {
    return loadingPromise;
  }

  // Start loading
  loadingPromise = fetch('/ABMS_REGIONAL_DISTRICTS_SP.geojson')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load GeoJSON: ${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      geojsonCache = data;
      console.log(`[BC Boundaries] Loaded ${data.features?.length || 0} regional districts`);
      return data;
    })
    .catch(error => {
      console.error('[BC Boundaries] Error loading GeoJSON:', error);
      loadingPromise = null; // Reset on error so we can retry
      throw error;
    });

  return loadingPromise;
}

/**
 * Extract region name from GeoJSON feature properties
 * @param {Object} feature - GeoJSON feature
 * @returns {string} Region name
 */
export function extractRegionName(feature) {
  const props = feature.properties || {};
  
  // Try various property names that might contain the region name
  return (
    props.ADMIN_AREA_NAME ||
    props.REGIONAL_DISTRICT ||
    props.NAME ||
    props.REGION_NAME ||
    props.ADMIN_AREA_ABBREVIATION ||
    'Unknown Region'
  );
}

/**
 * Find a feature by region name (fuzzy matching)
 * @param {Object} geojson - GeoJSON FeatureCollection
 * @param {string} regionName - Region name to find
 * @returns {Object|null} Matching feature or null
 */
export function findFeatureByRegionName(geojson, regionName) {
  if (!geojson || !geojson.features) {
    return null;
  }

  const normalizedSearch = regionName.toLowerCase().trim();

  for (const feature of geojson.features) {
    const featureName = extractRegionName(feature).toLowerCase();
    
    // Exact match
    if (featureName === normalizedSearch) {
      return feature;
    }

    // Check if search term is contained in feature name
    if (featureName.includes(normalizedSearch) || normalizedSearch.includes(featureName)) {
      return feature;
    }

    // Check properties for partial matches
    const props = feature.properties || {};
    for (const value of Object.values(props)) {
      if (typeof value === 'string' && value.toLowerCase().includes(normalizedSearch)) {
        return feature;
      }
    }
  }

  return null;
}

/**
 * Get all unique region names from the GeoJSON
 * @param {Object} geojson - GeoJSON FeatureCollection
 * @returns {string[]} Array of region names
 */
export function getAllRegionNames(geojson) {
  if (!geojson || !geojson.features) {
    return [];
  }

  const names = new Set();
  for (const feature of geojson.features) {
    const name = extractRegionName(feature);
    if (name && name !== 'Unknown Region') {
      names.add(name);
    }
  }

  return Array.from(names).sort();
}
