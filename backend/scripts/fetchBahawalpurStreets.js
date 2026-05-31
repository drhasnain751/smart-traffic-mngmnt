// backend/scripts/fetchBahawalpurStreets.js
// This script queries the Overpass API for all named highways in the Bahawalpur area.
// It returns an array of objects suitable for seeding the Intersection table.
// Dependencies: axios (already in package.json or will be installed).

import axios from 'axios';

/**
 * Fetch street names from OSM via Overpass.
 * Returns an array of objects: { name, latitude, longitude, congestionLevel, vehicleCount, status }
 */
export async function fetchStreets() {
  const query = `
  [out:json][timeout:60];
  area["name"="Bahawalpur"]; // select the Bahawalpur administrative area
  (way["highway"]["name"](area););
  out tags center;`;

  const url = 'https://overpass-api.de/api/interpreter';
  const response = await axios.post(url, query, {
    headers: { 'Content-Type': 'text/plain' },
    timeout: 60000,
  });

  const elements = response.data.elements || [];
  // Use the centre of each way if available, otherwise fallback to city centre.
  const cityCenter = { lat: 29.3955, lon: 71.7245 };

  const intersections = elements.map((el) => {
    const name = el.tags?.name || 'Unnamed Road';
    const lat = el.center?.lat ?? cityCenter.lat + (Math.random() - 0.5) * 0.02;
    const lon = el.center?.lon ?? cityCenter.lon + (Math.random() - 0.5) * 0.02;
    const congestion = Math.random(); // 0‑1 random for demo
    const vehicles = Math.floor(Math.random() * 100);
    const status = congestion > 0.75 ? 'ACTIVE' : 'ACTIVE'; // keep ACTIVE for now
    return {
      name,
      latitude: parseFloat(lat.toFixed(6)),
      longitude: parseFloat(lon.toFixed(6)),
      congestionLevel: parseFloat(congestion.toFixed(2)),
      vehicleCount: vehicles,
      status,
    };
  });
  return intersections;
}

// If run directly, print a summary (useful for debugging)
if (require.main === module) {
  fetchStreets()
    .then((list) => {
      console.log(`Fetched ${list.length} streets from OSM.`);
      // Show first few entries
      console.log(list.slice(0, 5));
    })
    .catch((err) => {
      console.error('Error fetching streets:', err.message);
    });
}
