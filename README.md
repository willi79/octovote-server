# OctoVote Server

Backend API for OctoVote — built with Node.js, Express, TypeScript, and MongoDB.

## Prerequisites

- Node.js 20+
- Yarn
- MongoDB

## Setup

```bash
# 1. Clone the repository
git clone https://github.com/willi79/octovote-server
cd octovote-server

# 2. Install dependencies
yarn install

# 3. Setup environment variables
cp .env.example .env
```

Open `.env` and configure the following:

```bash
MONGO_URI=        # your MongoDB connection string
JWT_SECRET=       # a long random secret string
ADMIN_EMAIL=      # email for the admin account
ADMIN_PASSWORD=   # password for the admin account
```

## Running the App

```bash
# development
yarn dev

# production
yarn build
yarn start
```

Admin account is seeded automatically on first startup.

## Running Tests

```bash
# run all tests
yarn test

# unit tests only (no database required)
yarn test:unit

# integration tests only (uses in-memory MongoDB)
yarn test:integration

# watch mode
yarn test:watch

# coverage report
yarn test:coverage
```

Unit tests cover pure business logic (services, utilities, helpers) with no database dependency.
Integration tests cover the full HTTP stack using an in-memory MongoDB instance — no external
database setup required.

## Project Structure

```
src/
  config/        # env, db connection, seed
  model/         # Mongoose schemas
  repository/    # data access layer (interfaces + implementations)
  service/       # business logic
  controller/    # HTTP request handlers
  route/         # Express routers
  middleware/    # auth middleware
  interface/     # shared TypeScript interfaces
  util/          # JWT utility
  helper/        # string helper
test/
  unit/          # pure logic tests (no DB)
  integration/   # full HTTP stack tests
```