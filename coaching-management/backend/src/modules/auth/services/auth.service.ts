import prisma from '../../../config/prisma.js';
import { comparePassword } from '../../../shared/utils/password.util.js';
import { generateAccessToken } from '../../../shared/utils/jwt.util.js';

export interface LoginInput {
  username: string;
  passwordHash: string; // Plain-text password passed from controller/input dto
}

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

export class AuthService {
  async login(username: string, plainTextPassword: string): Promise<LoginResult> {
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        role: true,
      },
    });

    if (!user) {
      const error: any = new Error('Invalid username or password.');
      error.statusCode = 401;
      throw error;
    }

    if (!user.isActive) {
      const error: any = new Error('User account is inactive. Please contact administrator.');
      error.statusCode = 403;
      throw error;
    }

    const isPasswordValid = await comparePassword(plainTextPassword, user.passwordHash);

    if (!isPasswordValid) {
      const error: any = new Error('Invalid username or password.');
      error.statusCode = 401;
      throw error;
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
}

export default new AuthService();
