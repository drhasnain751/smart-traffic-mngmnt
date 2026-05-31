import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.findUnique({ where: { email: 'admin@smartcity.gov' } });
  if (admin) {
    console.log('✅ Admin user exists:', admin.id, admin.email);
  } else {
    console.log('❌ Admin user NOT found');
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
