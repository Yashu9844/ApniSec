import { IssueRepository, CreateIssueData, UpdateIssueData } from '../repositories/IssueRepository';
import { UserRepository } from '../repositories/UserRepository';
import { EmailUtil } from '../utils/EmailUtil';
import { AppError } from '../errors/AppError';

export class IssueService {
  private issueRepository: IssueRepository;
  private userRepository?: UserRepository;

  constructor(issueRepository: IssueRepository, userRepository?: UserRepository) {
    this.issueRepository = issueRepository;
    this.userRepository = userRepository;
  }

  async createIssue(data: CreateIssueData) {
    const issue = await this.issueRepository.createIssue(data);

    // Send email notification
    if (this.userRepository) {
      try {
        const user = await this.userRepository.findUserById(data.userId);
        if (user) {
          await EmailUtil.sendIssueCreatedEmail(user.email, user.name, {
            type: data.type,
            title: data.title,
            description: data.description,
            priority: data.priority
          });
        }
      } catch (error) {
        console.error('Failed to send issue creation email:', error);
        // Don't block issue creation if email fails
      }
    }

    return issue;
  }

  async getIssueById(id: string, userId: string) {
    const issue = await this.issueRepository.findIssueById(id);
    
    if (!issue) {
      throw new AppError('Issue not found', 404);
    }

    // Ensure user can only access their own issues
    if (issue.userId !== userId) {
      throw new AppError('Unauthorized access to this issue', 403);
    }

    return issue;
  }

  async getUserIssues(userId: string, filters?: { type?: string; status?: string }) {
    return this.issueRepository.findIssuesByUserId(userId, filters);
  }

  async updateIssue(id: string, userId: string, data: UpdateIssueData) {
    // First check if issue exists and belongs to user
    const issue = await this.issueRepository.findIssueById(id);
    
    if (!issue) {
      throw new AppError('Issue not found', 404);
    }

    if (issue.userId !== userId) {
      throw new AppError('Unauthorized to update this issue', 403);
    }

    return this.issueRepository.updateIssue(id, data);
  }

  async deleteIssue(id: string, userId: string) {
    // First check if issue exists and belongs to user
    const issue = await this.issueRepository.findIssueById(id);
    
    if (!issue) {
      throw new AppError('Issue not found', 404);
    }

    if (issue.userId !== userId) {
      throw new AppError('Unauthorized to delete this issue', 403);
    }

    return this.issueRepository.deleteIssue(id);
  }

  async searchIssues(userId: string, searchTerm: string) {
    if (!searchTerm || searchTerm.trim().length < 2) {
      throw new AppError('Search term must be at least 2 characters', 400);
    }

    return this.issueRepository.searchIssues(userId, searchTerm);
  }

  async getIssueStats(userId: string) {
    const issues = await this.issueRepository.findIssuesByUserId(userId);
    
    return {
      total: issues.length,
      open: issues.filter(i => i.status === 'open').length,
      inProgress: issues.filter(i => i.status === 'in-progress').length,
      resolved: issues.filter(i => i.status === 'resolved').length,
      closed: issues.filter(i => i.status === 'closed').length,
      byType: {
        cloudSecurity: issues.filter(i => i.type === 'Cloud Security').length,
        reteamAssessment: issues.filter(i => i.type === 'Reteam Assessment').length,
        vapt: issues.filter(i => i.type === 'VAPT').length
      }
    };
  }
}
