# FinWatch API — Real-Time Financial Portfolio Tracker

A production-grade Node.js REST API for managing investment portfolios and setting up price-based alerts. Built with **Express.js**, **MongoDB**, and **Redis**, featuring JWT authentication, real-time WebSocket updates, and comprehensive testing.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Authentication Flow](#authentication-flow)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## 🎯 Overview

FinWatch API enables users to:
- **Track investments** with real-time portfolio management
- **Monitor prices** with automatic alerts when thresholds are crossed
- **Secure access** with JWT-based authentication and token rotation
- **Export data** in CSV format for analysis
- **Real-time updates** via WebSocket connections

The API is designed for scalability with Redis caching, rate limiting, and comprehensive error handling.

---

## ✨ Features

### Core Functionality
- ✅ **User Authentication** - Register, login, logout with secure JWT tokens
- ✅ **Token Rotation** - Automatic refresh token rotation to prevent replay attacks
- ✅ **Portfolio Management** - Add, update, delete investment holdings
- ✅ **Price Alerts** - Set alerts for stocks when prices cross target thresholds
- ✅ **Price Fetching** - Real-time stock data from Alpha Vantage API
- ✅ **CSV Export** - Download portfolio holdings as CSV
- ✅ **WebSocket Support** - Real-time alert notifications

### Security & Quality
- 🔒 **Password Hashing** - bcrypt with 12 salt rounds
- 🔐 **HTTPS Ready** - Helmet.js for security headers
- 🛡️ **Rate Limiting** - Express rate limiter for abuse prevention
- 📝 **Input Validation** - Zod schema validation on all endpoints
- 📊 **Comprehensive Logging** - Winston-based structured logging
- ✔️ **19 Test Cases** - Unit and integration tests with >95% coverage

---

## 🛠️ Tech Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Runtime** | Node.js 18+ | JavaScript runtime |
| **Framework** | Express.js 4.18+ | REST API framework |
| **Database** | MongoDB 9.6+ | Document database |
| **Auth** | JWT + bcrypt | Authentication & encryption |
| **Caching** | Redis 5.10+ | Session & data caching |
| **Validation** | Zod 4.4+ | Schema validation |
| **Testing** | Jest 30.4+ | Unit & integration tests |
| **Logging** | Winston 3.19+ | Structured logging |
| **Documentation** | Swagger/OpenAPI | API documentation |

---

## 🏗️ Project Architecture

### Directory Structure

```
src/
├── app.js                    # Express app configuration
├── server.js                 # Server entry point
├── config/                   # Configuration files
│   ├── env.js               # Environment variables
│   ├── database.js          # MongoDB connection
│   ├── redis.js             # Redis connection
│   ├── logger.js            # Winston logger setup
│   └── swagger.js           # Swagger documentation
├── middleware/              # Express middleware
│   ├── protect.js           # JWT authentication
│   ├── validate.js          # Request validation
│   ├── errorHandler.js      # Error handling
│   ├── rateLimiter.js       # Rate limiting
│   └── requestLogger.js     # Request logging
├── models/                  # MongoDB schemas
│   ├── User.js             # User model with password hashing
│   ├── Portfolio.js        # Portfolio & holdings model
│   └── Alert.js            # Price alert model
├── controllers/            # Route handlers
│   ├── authController.js   # Auth endpoints
│   ├── portfolioController.js
│   ├── alertController.js
│   └── priceController.js
├── services/              # Business logic
│   ├── authService.js     # Auth logic (register, login, refresh)
│   ├── portfolioService.js
│   ├── alertService.js
│   ├── alertChecker.js    # Alert trigger logic
│   ├── priceService.js    # Alpha Vantage API integration
│   ├── exportService.js   # CSV export logic
│   └── notifications/     # Notification handlers
│       ├── socketNotifier.js
│       └── consoleNotifier.js
├── routes/               # Route definitions
│   ├── authRoutes.js
│   ├── portfolioRoutes.js
│   ├── alertRoutes.js
│   └── priceRoutes.js
├── validators/           # Zod validation schemas
│   ├── authValidator.js
│   └── portfolioValidator.js
├── utils/               # Utility functions
│   ├── AppError.js      # Custom error class
│   ├── asyncHandler.js  # Async error wrapper
│   ├── generateTokens.js  # JWT token generation
│   └── csvTransform.js   # CSV streaming
└── repositories/        # Data access layer
    └── alertRepository.js
```

### Request Flow

```
HTTP Request
    ↓
Middleware (helmet, cors, parser, logger)
    ↓
Route Handler
    ↓
Validation Middleware (Zod schema)
    ↓
Authentication Middleware (JWT verify) [if protected]
    ↓
Controller (extract request data)
    ↓
Service (business logic)
    ↓
Repository (database access)
    ↓
Response (JSON or error)
    ↓
Error Handler (if any error)
    ↓
HTTP Response to Client
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([download](https://nodejs.org/))
- **MongoDB** 5.0+ ([cloud](https://www.mongodb.com/cloud/atlas) or [local](https://docs.mongodb.com/manual/installation/))
- **Redis** 6.0+ (optional, for caching)
- **npm** 8+ (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd finwatch-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your configuration (see [Configuration](#configuration))

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud) — update MONGO_URI in .env
   ```

5. **Start the server**
   ```bash
   # Development with auto-reload
   npm run dev
   
   # Production
   npm start
   ```

6. **Verify it's running**
   ```bash
   curl http://localhost:3000/health
   # Response: {"status":"ok","ts":1234567890}
   ```

### Access API Documentation

Visit `http://localhost:3000/api-docs` to see interactive Swagger documentation of all endpoints.

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root with these variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development  # development | production | test

# Database
MONGO_URI=mongodb://localhost:27017/finwatch
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/finwatch

# Authentication - JWT Secrets (use strong random strings in production)
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_different_secret_refresh_key_min_32_chars
JWT_REFRESH_EXPIRES_IN=7d

# Third-Party APIs
ALPHA_VANTAGE_KEY=your_api_key_from_alphavantage.co
# Get free key at: https://www.alphavantage.co/api/

# Redis (for caching and sessions)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=  # Leave empty if no password

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes in milliseconds
RATE_LIMIT_MAX=100           # Max requests per window

# CORS - Allowed origins (comma-separated)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Logging Level
LOG_LEVEL=debug  # debug | info | warn | error
```

### Generate Strong JWT Secrets

```bash
# Generate random 64-character strings
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)

#### Register a New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```
**Response (201):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```
**Requirements:**
- Name: 2-50 characters
- Email: Valid email format
- Password: Minimum 8 chars, must include uppercase, lowercase, and number

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```
**Response (200):** Same as register

#### Refresh Access Token
```http
POST /api/auth/refresh
Cookie: refreshToken=<refresh_token>
```
**Response (200):**
```json
{
  "status": "success",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <access_token>
```
**Response (200):** `{"status":"success","message":"Logged out"}`

---

### Portfolio Routes (`/api/portfolio`)

#### Get User's Portfolio
```http
GET /api/portfolio
Authorization: Bearer <access_token>
```
**Response (200):**
```json
{
  "status": "success",
  "data": {
    "holdings": [
      {
        "_id": "507f191e810c19729de860ea",
        "symbol": "AAPL",
        "quantity": 10,
        "avgBuyPrice": 150.25,
        "assetType": "stock",
        "createdAt": "2026-05-26T12:00:00Z"
      }
    ]
  }
}
```

#### Add a Holding
```http
POST /api/portfolio
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "symbol": "AAPL",
  "quantity": 10,
  "avgBuyPrice": 150.25,
  "assetType": "stock"
}
```
**Response (201):** Portfolio object with new holding

#### Update a Holding
```http
PATCH /api/portfolio/:holdingId
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "quantity": 15,
  "avgBuyPrice": 148.50
}
```
**Response (200):** Updated portfolio

#### Delete a Holding
```http
DELETE /api/portfolio/:holdingId
Authorization: Bearer <access_token>
```
**Response (204):** No content

---

### Alert Routes (`/api/alerts`)

#### Get All Alerts
```http
GET /api/alerts
Authorization: Bearer <access_token>
```

#### Create Price Alert
```http
POST /api/alerts
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "symbol": "AAPL",
  "condition": "above",  # or "below"
  "targetPrice": 180
}
```

#### Update Alert
```http
PATCH /api/alerts/:alertId
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "targetPrice": 175,
  "active": true
}
```

#### Delete Alert
```http
DELETE /api/alerts/:alertId
Authorization: Bearer <access_token>
```

---

### Price Routes (`/api/prices`)

#### Get Current Stock Price
```http
GET /api/prices/:symbol
```
**Response (200):**
```json
{
  "status": "success",
  "data": {
    "symbol": "AAPL",
    "price": 189.95,
    "timestamp": "2026-05-26T17:00:00Z"
  }
}
```

---

## 💾 Database Schema

### User Collection

```javascript
{
  _id: ObjectId,
  name: String,              // 2-50 chars
  email: String,             // Unique, indexed
  password: String,          // Hashed with bcrypt (not returned)
  role: String,              // "user" or "admin"
  refreshToken: String,      // For token rotation (hidden by default)
  createdAt: Date,
  updatedAt: Date
}
```

**Key Features:**
- Password is hashed before saving (bcrypt, 12 rounds)
- `select: false` prevents password from being returned in queries
- Unique email index for fast lookups and preventing duplicates

### Portfolio Collection

```javascript
{
  _id: ObjectId,
  user: ObjectId,            // Reference to User
  holdings: [
    {
      symbol: String,        // Uppercase ticker (AAPL, MSFT)
      name: String,          // Company name
      quantity: Number,      // Shares owned
      avgBuyPrice: Number,   // Average purchase price
      assetType: String,     // "stock" or "crypto"
      createdAt: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### Alert Collection

```javascript
{
  _id: ObjectId,
  user: ObjectId,            // Reference to User
  symbol: String,            // Stock ticker
  condition: String,         // "above" or "below"
  targetPrice: Number,       // Alert threshold
  triggered: Boolean,        // Has alert fired?
  triggeredAt: Date,         // When it triggered
  active: Boolean,           // Is alert active?
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Authentication Flow

### JWT Token Structure

Access tokens include:
```javascript
{
  sub: userId,        // JWT standard subject claim
  role: userRole,
  jti: uniqueId,      // JWT ID (for uniqueness)
  iat: issuedAt,
  exp: expiresAt
}
```

### Token Rotation Flow (Security Best Practice)

```
1. User logs in
   └─> Server generates new token pair
   └─> Stores refresh token hash in DB
   └─> Returns access token + refresh token in cookie

2. Access token expires (15 minutes)
   └─> Client sends refresh token
   └─> Server validates against stored hash
   └─> Generates new token pair
   └─> Invalidates old refresh token

3. Attack vector: Token replay
   └─> Old refresh token won't match stored hash
   └─> Request rejected with 401
```

### Protected Routes

All `/api/portfolio`, `/api/alerts` routes require:
```http
Authorization: Bearer <access_token>
```

The `protect` middleware:
1. Extracts token from `Authorization: Bearer ...` header
2. Verifies signature with `JWT_SECRET`
3. Checks token hasn't expired
4. Confirms user still exists in database
5. Attaches user info to `req.user`

---

## ✅ Testing

### Run All Tests

```bash
# Run all tests
npm test

# Watch mode (re-run on file changes)
npm test -- --watch

# With coverage report
npm run test:cov
```

### Test Structure

```
tests/
├── unit/
│   ├── authService.test.js      # 9 tests: register, login, refresh, logout
│   └── alertChecker.test.js     # 1 test: alert trigger logic
├── integration/
│   ├── auth.test.js             # 5 tests: auth endpoints
│   └── portfolio.test.js         # 4 tests: portfolio endpoints
└── setup/
    ├── testDb.js                # In-memory MongoDB
    ├── testApp.js               # Test Express app
    ├── testSetup.js             # Global setup/teardown
    └── authHelper.js            # Helper functions
```

### Example Test

```javascript
it('returns tokens on valid credentials', async () => {
    const result = await authService.login({
        email: 'test@test.com',
        password: 'Password123'
    });
    
    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
});
```

### Current Test Coverage

- **19 total tests**
- **100% passing**
- **Auth Service**: Register, login, refresh token rotation
- **Portfolio**: Add, update, delete holdings
- **Alerts**: Trigger detection
- **Unit + Integration tests**

---

## 🚢 Deployment

### Production Checklist

- [ ] Use strong, random JWT secrets (minimum 32 characters)
- [ ] Set `NODE_ENV=production`
- [ ] Use MongoDB Atlas or managed MongoDB
- [ ] Configure CORS `ALLOWED_ORIGINS` for your frontend
- [ ] Use HTTPS only (Helmet.js handles headers)
- [ ] Set up Redis for caching/sessions
- [ ] Configure rate limiting for abuse prevention
- [ ] Enable structured logging to persistent storage
- [ ] Set up monitoring and alerting
- [ ] Use process manager (PM2, systemd, etc.)

### Using PM2 (Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Start with ecosystem.config.js
pm2 start ecosystem.config.js --env production

# Monitor
pm2 monit

# View logs
pm2 logs finwatch-api

# Restart on file changes
pm2 watch
```

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY src ./src
COPY .env ./.env

EXPOSE 3000

CMD ["npm", "start"]
```

### Environment Variables for Production

```bash
# Use strong secrets
JWT_SECRET=<64-character-random-string>
JWT_REFRESH_SECRET=<64-character-random-string>

# Use MongoDB Atlas
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/finwatch

# Use managed Redis
REDIS_HOST=redis.example.com
REDIS_PASSWORD=<your-redis-password>

# Tighten rate limiting
RATE_LIMIT_MAX=50

# CORS - only your frontend
ALLOWED_ORIGINS=https://app.example.com
```

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <pid> /F

# macOS/Linux
lsof -i :3000
kill -9 <pid>
```

### MongoDB Connection Failed

```bash
# Check MongoDB is running
mongosh  # Try to connect

# Check MONGO_URI is correct
# For local: mongodb://localhost:27017/finwatch
# For Atlas: mongodb+srv://user:pass@cluster.mongodb.net/finwatch
```

### Tests Failing

```bash
# Clear Jest cache
npm test -- --clearCache

# Run with verbose output
npm test -- --verbose

# Run specific test file
npm test alertChecker.test.js
```

### JWT Authentication Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Invalid access token` | Expired or bad signature | Login again to get new token |
| `Token expired` | Access token > 15 minutes old | Use refresh endpoint |
| `User no longer exists` | User deleted | Register new account |
| `Refresh token reuse detected` | Security check failed | Login again |

---

## 🤝 Contributing

### Code Standards

- Use **ESLint** for consistent formatting
- Write **unit tests** for new services
- Add **integration tests** for new endpoints
- Include **JSDoc comments** on functions
- Follow **async/await** over `.then()` chains

### Adding a New Endpoint

1. **Create validator** in `src/validators/`
   ```javascript
   const newSchema = z.object({
       field: z.string().min(1)
   });
   ```

2. **Add route** in `src/routes/`
   ```javascript
   router.post('/', validate(newSchema), controller.handler);
   ```

3. **Implement controller** in `src/controllers/`
   ```javascript
   const handler = asyncHandler(async (req, res) => {
       const data = await service.method(req.body);
       res.json({ status: 'success', data });
   });
   ```

4. **Implement service** in `src/services/`
   ```javascript
   const method = async (data) => {
       // Business logic
       return result;
   };
   ```

5. **Write tests** in `tests/`
   ```javascript
   it('should handle request correctly', async () => {
       // Test implementation
   });
   ```

### Pull Request Checklist

- [ ] All tests pass (`npm test`)
- [ ] No console errors
- [ ] Code is formatted
- [ ] JSDoc comments added
- [ ] Updated README if needed
- [ ] No sensitive data in commits

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP Security Headers](https://owasp.org/www-project-secure-headers/)
- [Alpha Vantage API](https://www.alphavantage.co/documentation/)
- [Redis Documentation](https://redis.io/documentation)

---

## 📄 License

ISC License — See LICENSE file for details

---

## 👤 Author

Gaurav Sinha — Original creator and maintainer

---

## 🙏 Support

For issues, questions, or contributions:
1. Check [Troubleshooting](#troubleshooting) section
2. Review test files for usage examples
![alt text](image.png)
3. Check Swagger docs at `/api-docs`
4. Open an issue on GitHub

---

**Last Updated:** May 26, 2026  
**Version:** 1.0.0  
**Status:** ✅ Production Ready