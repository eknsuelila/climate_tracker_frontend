/**
 * Mapping of BC Regional Districts to High-Level Regions
 * This mapping groups the 27 regional districts into 5 high-level regions.
 */

export const REGIONAL_DISTRICT_TO_REGION = {
  // Northern BC (7 districts)
  "Regional District of Bulkley-Nechako": "Northern BC",
  "Cariboo Regional District": "Northern BC",
  "Regional District of Fraser-Fort George": "Northern BC",
  "Regional District of Kitimat-Stikine": "Northern BC",
  "Peace River Regional District": "Northern BC",
  "North Coast Regional District": "Northern BC",
  "Stikine Region (Unincorporated)": "Northern BC",
  
  // Thompson-Okanagan (4 districts)
  "Regional District of Central Okanagan": "Thompson-Okanagan",
  "Regional District of Okanagan-Similkameen": "Thompson-Okanagan",
  "Regional District of North Okanagan": "Thompson-Okanagan",
  "Thompson-Nicola Regional District": "Thompson-Okanagan",
  
  // Lower Mainland (3 districts)
  "Metro Vancouver Regional District": "Lower Mainland",
  "Fraser Valley Regional District": "Lower Mainland",
  "Squamish-Lillooet Regional District": "Lower Mainland",
  
  // Vancouver Island & Coast (10 districts)
  "Capital Regional District": "Vancouver Island & Coast",
  "Comox Valley Regional District": "Vancouver Island & Coast",
  "Cowichan Valley Regional District": "Vancouver Island & Coast",
  "Regional District of Nanaimo": "Vancouver Island & Coast",
  "Regional District of Alberni-Clayoquot": "Vancouver Island & Coast",
  "Regional District of Mount Waddington": "Vancouver Island & Coast",
  "Strathcona Regional District": "Vancouver Island & Coast",
  "Central Coast Regional District": "Vancouver Island & Coast",
  "qathet Regional District": "Vancouver Island & Coast",
  "Sunshine Coast Regional District": "Vancouver Island & Coast",
  
  // Kootenay/Columbia (4 districts)
  "Regional District of Central Kootenay": "Kootenay/Columbia",
  "Regional District of East Kootenay": "Kootenay/Columbia",
  "Regional District of Kootenay Boundary": "Kootenay/Columbia",
  "Columbia Shuswap Regional District": "Kootenay/Columbia",
};

// High-level region colors
export const REGION_COLORS = {
  "Northern BC": "#3498db",
  "Thompson-Okanagan": "#e74c3c",
  "Lower Mainland": "#2ecc71",
  "Vancouver Island & Coast": "#f39c12",
  "Kootenay/Columbia": "#9b59b6",
};

// High-level region centers (for map centering)
export const REGION_CENTERS = {
  "Northern BC": [57.0, -125.0],
  "Thompson-Okanagan": [50.5, -119.0],
  "Lower Mainland": [49.2, -123.0],
  "Vancouver Island & Coast": [49.6, -125.0],
  "Kootenay/Columbia": [49.5, -116.0],
};


