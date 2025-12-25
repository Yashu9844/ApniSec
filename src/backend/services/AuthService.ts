import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/UserRepository';
import { JwtUtil } from '../utils/JwtUtil';
import { EmailUtil } from '../utils/EmailUtil';
import { AppError } from '../errors/AppError';
import { logger } from '../utils/Logger';

export class AuthService {
  private userRepository: UserRepository;
  private jwtUtil: JwtUtil;
  private emailUtil: any;
  private saltRounds: number;

  constructor(
    userRepository: UserRepository,
    jwtUtil: JwtUtil,
    emailUtil: any,
    saltRounds: number = 10
  ) {
    this.userRepository = userRepository;
    this.jwtUtil = jwtUtil;
    this.emailUtil = emailUtil;
    this.saltRounds = saltRounds;
  }

  async register(name: string, email: string, password: string): Promise<{ token: string; user: any }> {
    logger.debug('Registration attempt', { context: 'AuthService', metadata: { email } });

    // Check if user already exists
    const existingUser = await this.userRepository.findUserByEmail(email);
    if (existingUser) {
      logger.warn('Registration failed - email already exists', { context: 'AuthService', metadata: { email } });
      throw new AppError('Email already registered', 400);
    }

    // Hash password
    const hashedPassword = await this.hashPassword(password);

    // Create user
    const user = await this.userRepository.createUser({
      name,
      email,
      password: hashedPassword
    });

    logger.info('User registered successfully', { context: 'AuthService', userId: user.id, metadata: { email } });

    // Send welcome email
    await this.emailUtil.sendWelcomeEmail(email, name);

    // Generate JWT token
    const token = JwtUtil.sign({ id: user.id, email: user.email });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    };
  }

  async login(email: string, password: string): Promise<{ token: string; user: any }> {
    logger.debug('Login attempt', { context: 'AuthService', metadata: { email } });

    // Find user by email
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      logger.warn('Login failed - user not found', { context: 'AuthService', metadata: { email } });
      throw new AppError('Invalid credentials', 401);
    }

    // Compare password
    const isValidPassword = await this.comparePassword(password, user.password);
    if (!isValidPassword) {
      logger.warn('Login failed - invalid password', { context: 'AuthService', userId: user.id, metadata: { email } });
      throw new AppError('Invalid credentials', 401);
    }

    logger.info('User logged in successfully', { context: 'AuthService', userId: user.id, metadata: { email } });

    // Generate JWT token
    const token = JwtUtil.sign({ id: user.id, email: user.email });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    };
  }

  async getUserById(userId: string): Promise<any> {
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email
    };
  }

  async logout(userId: string): Promise<void> {
    // For JWT-based auth, logout is handled client-side by removing the token
    // This method can be used for additional cleanup if needed
    return;
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  private async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
