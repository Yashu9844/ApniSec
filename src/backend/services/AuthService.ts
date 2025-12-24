import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/UserRepository';
import { JwtUtil } from '../utils/JwtUtil';
import { EmailUtil } from '../utils/EmailUtil';

export class AuthService {
  private userRepository: UserRepository;
  private jwtUtil: JwtUtil;
  private emailUtil: EmailUtil;
  private saltRounds: number;

  constructor(
    userRepository: UserRepository,
    jwtUtil: JwtUtil,
    emailUtil: EmailUtil,
    saltRounds: number = 10
  ) {
    this.userRepository = userRepository;
    this.jwtUtil = jwtUtil;
    this.emailUtil = emailUtil;
    this.saltRounds = saltRounds;
  }

  async register(name: string, email: string, password: string): Promise<{ token: string; user: any }> {
    // Check if user already exists
    const existingUser = await this.userRepository.findUserByEmail(email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(password);

    // Create user
    const user = await this.userRepository.createUser({
      name,
      email,
      password: hashedPassword
    });

    // Send welcome email
    await EmailUtil.sendWelcomeEmail(email, name);

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
    // Find user by email
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Compare password
    const isValidPassword = await this.comparePassword(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

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
      throw new Error('User not found');
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
