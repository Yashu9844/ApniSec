# ApniSec - Security Platform

A full-stack security issue management platform built with Next.js, TypeScript, Prisma, and PostgreSQL. Features JWT authentication, rate limiting, email notifications, and a modern cybersecurity-themed UI.

## 📊 SEO Score

The application is optimized for SEO with **80%+ score**:

### Lighthouse SEO Score
![Lighthouse SEO Score](public/lighthouseseoscore.png)

### PageSpeed Insights
![PageSpeed Insights](public/pagespeed.web.dev_analysis_https-apni-sec-azure-vercel-app_xrmq90sss2_hl=en-US&form_factor=desktop.png)

## Features

### Authentication System
- **Custom JWT-based authentication** (no third-party auth services)
- Password hashing with bcrypt
- Protected routes middleware
- Forgot password & reset password functionality
- Email verification on registration

### Issue Management
- Create, read, update, delete security issues
- **Issue Types:**
  - Cloud Security
  - Reteam Assessment
  - VAPT (Vulnerability Assessment and Penetration Testing)
- Filter by type and status
- Search functionality
- Issue statistics dashboard

### User Profile
- View and update profile
- Change password securely
- Email notifications on profile update

### Rate Limiting
- Custom OOP-based rate limiter
- 100 requests per 15 minutes per IP
- Rate limit headers in responses (X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset)
- 429 status code when limit exceeded

### Email Integration (Resend)
- Welcome email on registration
- Issue creation notifications
- Password reset emails
- Profile update notifications

## Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, OOP Architecture
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** Custom JWT (jsonwebtoken)
- **Email:** Resend API
- **Testing:** Jest with React Testing Library

##  Project Structure

```
apnisec/
 prisma/
    schema.prisma          # Database schema
    seed.ts                # Database seeding
    migrations/            # Database migrations
 src/
    app/
       (auth)/            # Auth pages (login, register, etc.)
       api/               # API routes
          auth/          # Authentication endpoints
          issues/        # Issue management endpoints
          users/         # User profile endpoints
       dashboard/         # Protected dashboard page
       profile/           # User profile page
    backend/
       errors/            # Custom error classes
       handlers/          # Request handlers (OOP)
       repositories/      # Data access layer (OOP)
       services/          # Business logic (OOP)
       utils/             # Utilities (JWT, Email, RateLimiter)
       validators/        # Input validation (OOP)
    components/            # React components
 tests/                     # Test files
 package.json
```

## Setup Instructions

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (or use Neon/Supabase)
- Resend account for emails

### 1. Clone the Repository

```bash
git clone <repository-url>
cd apnisec
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@host:5432/database?sslmode=require"

# JWT Secret (generate a secure random string)
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# Resend Email API
RESEND_API_KEY="re_your_resend_api_key"

# App URL (for email links)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed the database
npx prisma db seed
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

##API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/auth/me` | Get current user (protected) |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password with token |

### User Profile

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile` | Get user profile (protected) |
| PUT | `/api/users/profile` | Update user profile (protected) |

### Issues

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/issues` | List user's issues (protected) |
| POST | `/api/issues` | Create new issue (protected) |
| GET | `/api/issues/[id]` | Get single issue (protected) |
| PUT | `/api/issues/[id]` | Update issue (protected) |
| DELETE | `/api/issues/[id]` | Delete issue (protected) |
| GET | `/api/issues/stats` | Get issue statistics (protected) |

### Query Parameters

- Filter by type: `GET /api/issues?type=Cloud Security`
- Filter by status: `GET /api/issues?status=open`
- Search: `GET /api/issues?search=vulnerability`

##  Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## Rate Limiting

All API endpoints include rate limiting:

- **Limit:** 100 requests per 15 minutes per IP
- **Headers included in response:**
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Requests remaining in window
  - `X-RateLimit-Reset`: Unix timestamp when limit resets
- **Error Response (429):**
  ```json
  {
    "success": false,
    "error": "Too many requests. Please try again later."
  }
  ```

## Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT token-based authentication
- Protected API routes with middleware
- Input validation and sanitization
- Rate limiting to prevent abuse
- SQL injection protection via Prisma ORM
- XSS protection via React's built-in escaping

## Email Templates

The application sends styled HTML emails for:
- Welcome email (on registration)
- Issue created notification
- Password reset link
- Profile updated notification

##  Frontend Pages

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | ApniSec themed landing page |
| Login | `/login` | User authentication |
| Register | `/register` | New user registration |
| Forgot Password | `/forgot-password` | Password reset request |
| Reset Password | `/reset-password` | Set new password |
| Dashboard | `/dashboard` | Issue management (protected) |
| Profile | `/profile` | User profile (protected) |

##  OOP Architecture

The backend follows a clean OOP architecture:

- **Handlers:** Process HTTP requests and responses
- **Services:** Contain business logic
- **Repositories:** Data access layer (database operations)
- **Validators:** Input validation logic
- **Utils:** Reusable utilities (JWT, Email, RateLimiter)
- **Errors:** Custom error classes



---

