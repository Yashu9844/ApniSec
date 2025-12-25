import { UserRepository } from '../repositories/UserRepository';
import { AppError } from '../errors/AppError';
import { EmailUtil } from '../utils/EmailUtil';
import { logger } from '../utils/Logger';
import bcrypt from 'bcrypt';

export interface UpdateProfileData {
  name?: string;
  email?: string;
  password?: string;
}

export class UserService {
  private userRepository: UserRepository;
  private saltRounds: number;

  constructor(userRepository: UserRepository, saltRounds: number = 10) {
    this.userRepository = userRepository;
    this.saltRounds = saltRounds;
  }

  async getUserProfile(userId: string) {
    const user = await this.userRepository.findUserById(userId);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };
  }

  async updateUserProfile(userId: string, data: UpdateProfileData) {
    logger.debug('Updating user profile', { context: 'UserService', userId, metadata: { fieldsUpdated: Object.keys(data) } });

    const user = await this.userRepository.findUserById(userId);
    
    if (!user) {
      logger.warn('Profile update failed - user not found', { context: 'UserService', userId });
      throw new AppError('User not found', 404);
    }

    // Check if email is being changed and if it's already taken
    if (data.email && data.email !== user.email) {
      const existingUser = await this.userRepository.findUserByEmail(data.email);
      if (existingUser) {
        throw new AppError('Email already in use', 400);
      }
    }

    const updateData: any = {};
    
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    
    if (data.password) {
      // Hash new password
      updateData.password = await bcrypt.hash(data.password, this.saltRounds);
    }

    const updatedUser = await this.userRepository.updateUser(userId, updateData);

    logger.info('User profile updated successfully', { 
      context: 'UserService', 
      userId, 
      metadata: { 
        fieldsUpdated: Object.keys(updateData).filter(k => k !== 'password'),
        passwordChanged: !!data.password 
      } 
    });

    // Send profile updated email notification
    try {
      await EmailUtil.sendProfileUpdatedEmail(updatedUser.email, updatedUser.name);
    } catch (error) {
      logger.warn('Failed to send profile update email', { 
        context: 'UserService', 
        userId,
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
      // Don't block profile update if email fails
    }

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      createdAt: updatedUser.createdAt
    };
  }
}
