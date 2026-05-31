// backend/scripts/fetchBahawalpurStreets.cjs
// CommonJS version of the street fetcher for Node execution
const axios = require('axios');

async function fetchStreets() {
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
  const cityCenter = { lat: 29.3955, lon: 71.7245 };
  const intersections = elements.map(el => {
    const name = el.tags?.name || 'Unnamed Road';
    const lat = el.center?.lat ?? cityCenter.lat + (Math.random() - 0.5) * 0.02;
    const lon = el.center?.lon ?? cityCenter.lon + (Math.random() - 0.5) * 0.02;
    const congestion = Math.random();
    const vehicles = Math.floor(Math.random() * 100);
    const status = 'ACTIVE';
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

if (require.main === module) {
  fetchStreets()
    .then(list => {
      console.log(JSON.stringify(list, null, 2));
    })
    .catch(err => {
      console.error('Error fetching streets:', err.message);
      process.exit(1);
    });
}

module.exports = { fetchStreets };
