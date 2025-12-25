import { POST as registerHandler } from '@/app/api/auth/register/route'
import { POST as loginHandler } from '@/app/api/auth/login/route'
import { GET as meHandler } from '@/app/api/auth/me/route'
import { createMockRequest, getResponseData, createAuthToken } from './helpers/testUtils'
import bcrypt from 'bcrypt'

// Mock Prisma - create instance inside factory
jest.mock('@prisma/client', () => {
  const { createMockPrisma } = require('./helpers/mockPrisma')
  return {
    PrismaClient: jest.fn(() => createMockPrisma()),
  }
})

// Mock EmailUtil - it's a class with static methods
jest.mock('@/backend/utils/EmailUtil', () => {
  return {
    EmailUtil: {
      sendWelcomeEmail: jest.fn().mockResolvedValue(undefined),
    },
  }
})

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}))

describe('Auth Tests', () => {
  let mockPrisma: any

  beforeEach(() => {
    jest.clearAllMocks()
    const { PrismaClient } = require('@prisma/client')
    mockPrisma = new PrismaClient()
    // Reset mock implementations
    mockPrisma.user.findUnique.mockClear()
    mockPrisma.user.create.mockClear()
  })

  describe('Registration', () => {
    test('1. register success - should create user and return token', async () => {
      // Mock: user doesn't exist
      mockPrisma.user.findUnique.mockResolvedValue(null)
      // Mock: password hashing
      ;(bcrypt.hash as jest.Mock).mockResolvedValue('$2b$10$hashedpassword')
      // Mock: user creation
      mockPrisma.user.create.mockResolvedValue({
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        password: '$2b$10$hashedpassword',
        createdAt: new Date(),
      })

      const req = createMockRequest('POST', {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      })

      const response = await registerHandler(req)
      const data = await getResponseData(response)

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.data).toHaveProperty('token')
      expect(data.data).toHaveProperty('user')
      expect(data.data.user.email).toBe('john@example.com')
      expect(mockPrisma.user.create).toHaveBeenCalled()
    })

    test('2. duplicate email - should reject registration', async () => {
      // Mock: user already exists
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'existing-user',
        email: 'existing@example.com',
        name: 'Existing User',
        password: 'hashed',
        createdAt: new Date(),
      })

      const req = createMockRequest('POST', {
        name: 'John Doe',
        email: 'existing@example.com',
        password: 'password123',
      })

      const response = await registerHandler(req)
      const data = await getResponseData(response)

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toContain('already registered')
    })

    test('3. invalid email - should reject registration', async () => {
      const req = createMockRequest('POST', {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'password123',
      })

      const response = await registerHandler(req)
      const data = await getResponseData(response)

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })

    test('4. missing password - should reject registration', async () => {
      const req = createMockRequest('POST', {
        name: 'John Doe',
        email: 'john@example.com',
      })

      const response = await registerHandler(req)
      const data = await getResponseData(response)

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })
  })

  describe('Login', () => {
    test('5. login success - should return token and user', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10)
      
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        createdAt: new Date(),
      })

      ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)

      const req = createMockRequest('POST', {
        email: 'john@example.com',
        password: 'password123',
      })

      const response = await loginHandler(req)
      const data = await getResponseData(response)

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toHaveProperty('token')
      expect(data.data.user.email).toBe('john@example.com')
    })

    test('6. wrong password - should reject login', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        password: '$2b$10$hashedpassword',
        createdAt: new Date(),
      })

      ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)

      const req = createMockRequest('POST', {
        email: 'john@example.com',
        password: 'wrongpassword',
      })

      const response = await loginHandler(req)
      const data = await getResponseData(response)

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Invalid credentials')
    })

    test('7. unregistered email login - should reject login', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null)

      const req = createMockRequest('POST', {
        email: 'nonexistent@example.com',
        password: 'password123',
      })

      const response = await loginHandler(req)
      const data = await getResponseData(response)

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Invalid credentials')
    })

    test('8. JWT generated - should contain valid token', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null)
      ;(bcrypt.hash as jest.Mock).mockResolvedValue('$2b$10$hashedpassword')
      mockPrisma.user.create.mockResolvedValue({
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        password: '$2b$10$hashedpassword',
        createdAt: new Date(),
      })

      const req = createMockRequest('POST', {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      })

      const response = await registerHandler(req)
      const data = await getResponseData(response)

      expect(data.data.token).toBeDefined()
      expect(typeof data.data.token).toBe('string')
      expect(data.data.token.length).toBeGreaterThan(0)

      // Verify token can be decoded
      const jwt = require('jsonwebtoken')
      const decoded = jwt.verify(data.data.token, process.env.JWT_SECRET)
      expect(decoded.id).toBe('user-123')
      expect(decoded.email).toBe('john@example.com')
    })
  })

  describe('Get Me Endpoint', () => {
    test('9. /me without auth - should return unauthorized', async () => {
      const req = createMockRequest('GET')

      const response = await meHandler(req)
      const data = await getResponseData(response)

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Unauthorized')
    })

    test('10. /me with auth - should return user', async () => {
      const token = createAuthToken('user-123', 'john@example.com')
      
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        password: '$2b$10$hashedpassword',
        createdAt: new Date(),
      })

      const req = createMockRequest('GET', undefined, {
        authorization: `Bearer ${token}`,
      })

      const response = await meHandler(req)
      const data = await getResponseData(response)

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.user).toHaveProperty('id')
      expect(data.data.user).toHaveProperty('email')
      expect(data.data.user.email).toBe('john@example.com')
    })
  })
})
