import { NextRequest } from 'next/server'

// Helper to create mock NextRequest
export function createMockRequest(
  method: string = 'GET',
  body?: any,
  headers: Record<string, string> = {}
): NextRequest {
  const url = 'http://localhost:3000/api/test'
  const init = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  } as RequestInit

  if (body) {
    init.body = JSON.stringify(body)
  }

  return new NextRequest(url, init)
}

// Helper to extract JSON from NextResponse
export async function getResponseData(response: Response) {
  const text = await response.text()
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

// Helper to create auth token
export function createAuthToken(userId: string = 'user-123', email: string = 'test@example.com') {
  const jwt = require('jsonwebtoken')
  return jwt.sign({ id: userId, email }, process.env.JWT_SECRET || 'test-secret', { expiresIn: '7d' })
}

