import { PrismaClient, RoleName } from '@prisma/client';

const prisma = new PrismaClient();

const main = async (): Promise<void> => {
  console.log('🌱 Starting database seeding...');

  // 1. Seed Roles idempotently
  const rolesToSeed: { name: RoleName; description: string }[] = [
    { name: RoleName.ADMIN, description: 'System Administrator with full management access' },
    { name: RoleName.HELPDESK, description: 'Helpdesk staff for student registration and token assignment' },
    { name: RoleName.RECEPTIONIST, description: 'Receptionist staff for course selection and payment recording' },
    { name: RoleName.FOUNDING_MEMBER, description: 'Founding Member for payment verification, approval, and rejection' },
  ];

  for (const r of rolesToSeed) {
    await prisma.role.upsert({
      where: { name: r.name },
      update: { description: r.description },
      create: { name: r.name, description: r.description },
    });
    console.log(`✅ Role seeded: ${r.name}`);
  }

  console.log('🏁 Database seeding completed successfully.');
};

main()
  .catch((e) => {
    console.error('❌ Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


