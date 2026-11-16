import { PrismaClient, RoleName } from '@prisma/client';
import { hashPassword } from '../src/shared/utils/password.util.js';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Seed Roles idempotently
  const rolesToSeed: { name: RoleName; description: string }[] = [
    { name: RoleName.ADMIN, description: 'System Administrator with full management access' },
    { name: RoleName.HELPDESK, description: 'Helpdesk staff for student registration and token assignment' },
    { name: RoleName.RECEPTIONIST, description: 'Receptionist staff for course selection and payment recording' },
    { name: RoleName.FOUNDING_MEMBER, description: 'Founding Member for payment verification, approval, and rejection' },
  ];

  const roleMap: Record<RoleName, string> = {} as Record<RoleName, string>;

  for (const r of rolesToSeed) {
    const roleRecord = await prisma.role.upsert({
      where: { name: r.name },
      update: { description: r.description },
      create: { name: r.name, description: r.description },
    });
    roleMap[r.name] = roleRecord.id;
    console.log(`✅ Role seeded: ${r.name}`);
  }

  // 2. Seed Initial Admin User idempotently
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@coaching.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'SecureAdminPassword123!';
  const adminFullName = process.env.ADMIN_FULL_NAME || 'System Administrator';

  const existingAdmin = await prisma.user.findFirst({
    where: {
      OR: [
        { username: adminUsername },
        { email: adminEmail },
      ],
    },
  });

  if (existingAdmin) {
    console.log(`ℹ️ Admin user already exists (Username: ${existingAdmin.username}, Email: ${existingAdmin.email || 'N/A'}). Skipping creation to preserve credentials and role.`);
  } else {
    const adminRoleId = roleMap[RoleName.ADMIN];
    if (!adminRoleId) {
      throw new Error('ADMIN role ID not found in seeded roles map.');
    }

    const passwordHash = await hashPassword(adminPassword);

    const newAdmin = await prisma.user.create({
      data: {
        roleId: adminRoleId,
        username: adminUsername,
        email: adminEmail,
        passwordHash,
        fullName: adminFullName,
        isActive: true,
      },
    });

    console.log(`✅ Initial Admin user created successfully (Username: ${newAdmin.username}, ID: ${newAdmin.id})`);
  }

  console.log('🏁 Database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
