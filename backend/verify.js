import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verify() {
  const count = await prisma.intersection.count();
  console.log(`Intersections count: ${count}`);
  const sample = await prisma.intersection.findMany({
    take: 5,
    select: { id: true, name: true, trafficFlowHistory: true }
  });
  console.log('Sample intersections with trafficFlowHistory:');
  console.dir(sample, { depth: null });
}

verify()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
