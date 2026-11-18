import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../app.js';
import prisma from '../config/prisma.js';
import { hashPassword } from '../shared/utils/password.util.js';
import { generateAccessToken } from '../shared/utils/jwt.util.js';


let server: any;
let baseUrl: string;
let adminRoleId: string;
let testAdminToken: string;

test.before(async () => {
  server = app.listen(0);
  const address = server.address();
  const port = typeof address === 'object' && address !== null ? address.port : 5000;
  baseUrl = `http://localhost:${port}`;

  const role = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: { name: 'ADMIN', description: 'Administrator' },
  });
  adminRoleId = role.id;

  const passwordHash = await hashPassword('TestAdmin123!');
  const testUser = await prisma.user.upsert({
    where: { username: 'test_admin_user' },
    update: { passwordHash, isActive: true },
    create: {
      username: 'test_admin_user',
      email: 'test_admin@coaching.com',
      fullName: 'Test Admin',
      passwordHash,
      roleId: adminRoleId,
      isActive: true,
    },
  });

  const inactiveUser = await prisma.user.upsert({
    where: { username: 'test_inactive_user' },
    update: { passwordHash, isActive: false },
    create: {
      username: 'test_inactive_user',
      email: 'test_inactive@coaching.com',
      fullName: 'Test Inactive',
      passwordHash,
      roleId: adminRoleId,
      isActive: false,
    },
  });

  testAdminToken = generateAccessToken({
    userId: testUser.id,
    role: 'ADMIN',
    email: testUser.email || undefined,
  });
});

test.after(async () => {
  await prisma.user.deleteMany({
    where: {
      username: {
        in: ['test_admin_user', 'test_inactive_user', 'created_via_api'],
      },
    },
  }).catch(() => {});

  await prisma.auditLog.deleteMany({
    where: {
      module: 'auth',
    },
  }).catch(() => {});

test('Integration Test: Health Check', async () => {
  const res = await fetch(`${baseUrl}/health`);
  assert.equal(res.status, 200);
  const json: any = await res.json();
  assert.equal(json.status, 'OK');
});

test('Integration Test: POST /api/auth/login - Success', async () => {
  const res = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'test_admin_user',
      password: 'TestAdmin123!',
    }),
  });

  assert.equal(res.status, 200);
  const json: any = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.accessToken);
  assert.equal(json.data.user.username, 'test_admin_user');
  assert.equal(json.data.user.role, 'ADMIN');
});

test('Integration Test: POST /api/auth/login - Invalid Credentials', async () => {
  const res = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'test_admin_user',
      password: 'WrongPassword!',
    }),
  });

  assert.equal(res.status, 401);
  const json: any = await res.json();
  assert.equal(json.success, false);
});

test('Integration Test: POST /api/auth/login - Inactive Account', async () => {
  const res = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'test_inactive_user',
      password: 'TestAdmin123!',
    }),
  });

  assert.equal(res.status, 403);
  const json: any = await res.json();
  assert.equal(json.success, false);
});

test('Integration Test: GET /api/auth/me - Authenticated Success', async () => {
  const res = await fetch(`${baseUrl}/api/auth/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${testAdminToken}`,
    },
  });

  assert.equal(res.status, 200);
  const json: any = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.data.role, 'ADMIN');
});

test('Integration Test: GET /api/auth/me - Unauthorized (Missing Token)', async () => {
  const res = await fetch(`${baseUrl}/api/auth/me`, {
    method: 'GET',
  });

  assert.equal(res.status, 401);
  const json: any = await res.json();
  assert.equal(json.success, false);
});

test('Integration Test: GET /api/auth/me - Unauthorized (Invalid/Expired Token)', async () => {
  const res = await fetch(`${baseUrl}/api/auth/me`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalidtoken.signature',
    },
  });

  assert.equal(res.status, 401);
  const json: any = await res.json();
  assert.equal(json.success, false);
});

test('Integration Test: POST /api/auth/users - Admin Creation Success', async () => {
  const res = await fetch(`${baseUrl}/api/auth/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${testAdminToken}`,
    },
    body: JSON.stringify({
      username: 'created_via_api',
      email: 'created_api@coaching.com',
      password: 'NewUserPassword123!',
      fullName: 'Created Via API',
      roleName: 'RECEPTIONIST',
    }),
  });

  assert.equal(res.status, 201);
  const json: any = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.data.user.username, 'created_via_api');
  assert.equal(json.data.user.role, 'RECEPTIONIST');
});

test('Integration Test: POST /api/auth/users - Duplicate Username Conflict', async () => {
  const res = await fetch(`${baseUrl}/api/auth/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${testAdminToken}`,
    },
    body: JSON.stringify({
      username: 'created_via_api',
      email: 'another_email@coaching.com',
      password: 'NewUserPassword123!',
      fullName: 'Duplicate User',
      roleName: 'HELPDESK',
    }),
  });

  assert.equal(res.status, 409);
  const json: any = await res.json();
  assert.equal(json.success, false);
});


  await new Promise<void>((resolve) => {
    if (server) {
      server.close(() => resolve());
    } else {
      resolve();
    }
  });

  await prisma.$disconnect();
});
