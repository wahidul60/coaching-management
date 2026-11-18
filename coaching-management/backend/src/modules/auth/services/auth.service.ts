import prisma from '../../../config/prisma.js';
import { comparePassword, hashPassword } from '../../../shared/utils/password.util.js';
import { generateAccessToken } from '../../../shared/utils/jwt.util.js';
import { RoleName } from '@prisma/client';

export interface AuthResponseUser {
  id: string;
  username: string;
  email: string | null;
  fullName: string;
  role: string;
  isActive: boolean;
}

export interface LoginResult {
  user: AuthResponseUser;
  accessToken: string;
}

export interface CreateUserInput {
  username: string;
  email?: string | null;
  password: string;
  fullName: string;
  roleName: RoleName;
}

export class AuthService {
  async login(username: string, plainTextPassword: string, ipAddress?: string): Promise<LoginResult> {
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        role: true,
      },
    });

    if (!user) {
      // Record audit log for failed login with proper error handling (no plaintext credentials)
      try {
        await prisma.auditLog.create({
          data: {
            action: 'AUTH_LOGIN_FAILED',
            module: 'auth',
            details: { username, reason: 'User not found' },
            ipAddress: ipAddress || null,
          },
        });
      } catch (auditError) {
        console.error('Failed to persist audit log (AUTH_LOGIN_FAILED):', auditError);
      }

      const error: any = new Error('Invalid username or password.');
      error.statusCode = 401;
      throw error;
    }

    if (!user.isActive) {
      try {
        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: 'AUTH_LOGIN_BLOCKED_INACTIVE',
            module: 'auth',
            details: { username },
            ipAddress: ipAddress || null,
          },
        });
      } catch (auditError) {
        console.error('Failed to persist audit log (AUTH_LOGIN_BLOCKED_INACTIVE):', auditError);
      }

      const error: any = new Error('User account is inactive. Please contact administrator.');
      error.statusCode = 403;
      throw error;
    }

    const isPasswordValid = await comparePassword(plainTextPassword, user.passwordHash);

    if (!isPasswordValid) {
      try {
        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: 'AUTH_LOGIN_FAILED',
            module: 'auth',
            details: { username, reason: 'Invalid password' },
            ipAddress: ipAddress || null,
          },
        });
      } catch (auditError) {
        console.error('Failed to persist audit log (AUTH_LOGIN_FAILED):', auditError);
      }

      const error: any = new Error('Invalid username or password.');
      error.statusCode = 401;
      throw error;
    }

    // Record successful login audit log
    try {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'AUTH_LOGIN_SUCCESS',
          module: 'auth',
          details: { username, role: user.role.name },
          ipAddress: ipAddress || null,
        },
      });
    } catch (auditError) {
      console.error('Failed to persist audit log (AUTH_LOGIN_SUCCESS):', auditError);
    }

    const tokenPayload = {
      userId: user.id,
      role: user.role.name,
      email: user.email || undefined,
    };

    const accessToken = generateAccessToken(tokenPayload);

    const safeUser: AuthResponseUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role.name,
      isActive: user.isActive,
    };

    return {
      user: safeUser,
      accessToken,
    };
  }

  async createUser(input: CreateUserInput, actorUserId: string, ipAddress?: string): Promise<AuthResponseUser> {
    // Check if username or email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: input.username },
          ...(input.email ? [{ email: input.email }] : []),
        ],
      },
    });

    if (existingUser) {
      const error: any = new Error(
        existingUser.username === input.username
          ? 'Username is already taken.'
          : 'Email is already registered.'
      );
      error.statusCode = 409;
      throw error;
    }

    // Find role ID by name
    const role = await prisma.role.findUnique({
      where: { name: input.roleName },
    });

    if (!role) {
      const error: any = new Error(`Role ${input.roleName} not found.`);
      error.statusCode = 400;
      throw error;
    }

    const passwordHash = await hashPassword(input.password);

    // Use Prisma transaction to guarantee atomicity between user creation and audit logging
    const newUser = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          username: input.username,
          email: input.email || null,
          passwordHash,
          fullName: input.fullName,
          roleId: role.id,
          isActive: true,
        },
        include: {
          role: true,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: actorUserId,
          action: 'USER_CREATED',
          module: 'auth',
          details: { createdUserId: createdUser.id, username: createdUser.username, role: role.name },
          ipAddress: ipAddress || null,
        },
      });

      return createdUser;
    });

    return {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      fullName: newUser.fullName,
      role: newUser.role.name,
      isActive: newUser.isActive,
    };
  }
}

export default new AuthService();


