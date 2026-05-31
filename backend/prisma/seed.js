import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ... (rest of file unchanged)
const prisma = new PrismaClient();

async function fetchAllStreets() {
  const query = `[out:json][timeout:25];
  area["name"="Bahawalpur"]["admin_level"="8"]->searchArea;
  (
    way["highway"](area.searchArea);
  );
  out center;`;
  // Helper delay function
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await axios.get('https://overpass-api.de/api/interpreter', {
        params: { data: query },
        headers: { 'User-Agent': 'SmartIoTTrafficManagement/1.0 (+https://example.com)' }
      });
      const elems = response.data.elements || [];
      return elems.map(el => {
        const now = new Date();
        const history = Array.from({ length: 4 }, (_, i) => ({
          timestamp: new Date(now.getTime() - i * 5 * 60 * 1000).toISOString(),
          vehicleCount: Math.floor(Math.random() * 200),
          averageSpeed: 40 + Math.random() * 20,
          congestionLevel: Math.random()
        }));
        return {
          name: el.tags?.name || 'Unnamed Road',
          latitude: el.center?.lat ?? 0,
          longitude: el.center?.lon ?? 0,
          status: 'NORMAL',
          congestionLevel: 0.0,
          vehicleCount: 0,
          trafficFlowHistory: JSON.stringify(history)
        };
      });
    } catch (e) {
      if (attempt < maxAttempts) {
        await delay(2000); // wait before retry
      } else {
        // Fallback to static JSON data
        const fallbackPath = join(__dirname, '..', 'data', 'bahawalpur_roads.json');
        if (fs.existsSync(fallbackPath)) {
          const raw = fs.readFileSync(fallbackPath, 'utf-8');
          return JSON.parse(raw);
        }
        console.error('Failed to fetch road data from Overpass and no fallback file found.', e);
        return [];
      }
    }
  }
}

async function main() {
  console.log('Seeding database...');

  const intersectionData = await fetchAllStreets();

  if (!intersectionData || intersectionData.length === 0) {
    console.error('No street data fetched. Seeding aborted.');
    return;
  }

  const intersections = [];
  for (const item of intersectionData) {
    const intersection = await prisma.intersection.create({
      data: item
    });
    intersections.push(intersection);
  }
  // Create default admin user for testing (upsert)
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@smartcity.gov' },
    update: {},
    create: {
      email: 'admin@smartcity.gov',
      password: adminPasswordHash,
      name: 'Admin User',
      role: 'ADMIN'
    }
  });

  // 3. Roads and Signals for each intersection
  const directions = ['NORTH', 'SOUTH', 'EAST', 'WEST'];
  const roadNames = ['Grand Avenue', 'Metro Boulevard', 'Express Link', 'Central Way'];

  for (let i = 0; i < intersections.length; i++) {
    const intersection = intersections[i];

    // Create 4 roads connected to this intersection
    for (let d = 0; d < 4; d++) {
      await prisma.road.create({
        data: {
          name: `${intersection.name.split(' & ')[d % 2 === 0 ? 0 : 1]} Approach`,
          direction: directions[d],
          laneCount: d % 2 === 0 ? 3 : 2,
          capacity: d % 2 === 0 ? 120 : 80,
          currentSpeed: 55.0 - (intersection.congestionLevel * 40.0) + (Math.random() * 5),
          intersectionId: intersection.id
        }
      });
    }

    // Create Signal for intersection
    const activeStates = ['RED', 'YELLOW', 'GREEN'];
    await prisma.signal.create({
      data: {
        intersectionId: intersection.id,
        mode: intersection.status === 'OVERRIDE' ? 'MANUAL' : 'AUTO',
        activeState: activeStates[i % 3],
        timerSeconds: Math.floor(Math.random() * 20) + 10,
        redDuration: 30,
        yellowDuration: 5,
        greenDuration: 35,
        lastStateChange: new Date(Date.now() - (Math.random() * 30000))
      }
    });

    // Create initial Traffic Flow entry
    await prisma.trafficFlow.create({
      data: {
        intersectionId: intersection.id,
        timestamp: new Date(),
        vehicleCount: intersection.vehicleCount,
        averageSpeed: 50.0 - (intersection.congestionLevel * 35.0),
        occupancyRate: intersection.congestionLevel * 100,
        densityLevel: intersection.congestionLevel > 0.75 ? 'HIGH' : intersection.congestionLevel > 0.4 ? 'MEDIUM' : 'LOW'
      }
    });
  }
  console.log('Roads, Signals, and TrafficFlow histories seeded.');

  // 4. Alerts
  const alertsData = [
    {
      intersectionId: intersections[2].id, // Abdul Qadir Bazaar & D-Gate Road
      type: 'CONGESTION',
      severity: 'CRITICAL',
      message: 'Severe congestion at Abdul Qadir Bazaar & D-Gate Road due to sudden traffic surge.',
      status: 'ACTIVE',
    },
    {
      intersectionId: intersections[0].id, // Jinnah Road & Katchery Street
      type: 'ACCIDENT',
      severity: 'HIGH',
      message: 'Minor collision reported at Jinnah Road & Katchery Street causing brief delay.',
      status: 'ACTIVE',
    },
    {
      intersectionId: intersections[6].id, // Bahawalpur Airport Access Rd & Bypass
      type: 'SIGNAL_FAILURE',
      severity: 'MEDIUM',
      message: 'Signal controller offline at airport access, fallback to flashing red mode.',
      status: 'ACTIVE',
    },
    {
      intersectionId: intersections[3].id, // Abdul Qadir Bazaar & D-Gate Road
      type: 'EMERGENCY_OVERRIDE',
      severity: 'LOW',
      message: 'VIP convoy override active at Abdul Qadir Bazaar & D-Gate Road. Restoring auto soon.',
      status: 'RESOLVED',
      createdAt: new Date(Date.now() - 3600000),
      resolvedAt: new Date(Date.now() - 3000000),
    }
  ];

  for (const item of alertsData) {
    await prisma.alert.create({
      data: item
    });
  }
  console.log('Alerts seeded.');

  // 5. Reports
  const reportsData = [];

  for (const item of reportsData) {
    await prisma.report.create({
      data: item
    });
  }
  console.log('Reports seeded.');

  console.log('Database Seeding Completed Successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
