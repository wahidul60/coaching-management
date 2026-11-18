import test from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, comparePassword } from '../shared/utils/password.util.js';
import { generateAccessToken, verifyAccessToken } from '../shared/utils/jwt.util.js';

test('Password Utility: hashPassword and comparePassword', async () => {
  const plainPassword = 'SuperSecretPassword123!';
  const hashedPassword = await hashPassword(plainPassword);

  assert.notEqual(hashedPassword, plainPassword);
  assert.equal(typeof hashedPassword, 'string');

  const isMatch = await comparePassword(plainPassword, hashedPassword);
  assert.equal(isMatch, true);

  const isWrongMatch = await comparePassword('WrongPassword', hashedPassword);
  assert.equal(isWrongMatch, false);
});

test('JWT Utility: generateAccessToken and verifyAccessToken', () => {
  const payload = {
    userId: '123e4567-e89b-12d3-a456-426614174000',
    role: 'ADMIN',
    email: 'admin@coaching.com',
  };

  const token = generateAccessToken(payload);
  assert.equal(typeof token, 'string');
  assert.ok(token.length > 20);

  const decoded = verifyAccessToken(token);
  assert.notEqual(decoded, null);
  assert.equal(decoded?.userId, payload.userId);
  assert.equal(decoded?.role, payload.role);
  assert.equal(decoded?.email, payload.email);

  const invalidDecoded = verifyAccessToken('invalid.jwt.token');
  assert.equal(invalidDecoded, null);
});

