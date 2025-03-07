// tests/api.test.js
jest.setTimeout(30000); // 30 seconds timeout for slow database operations

const request = require('supertest');
const app = require('../app'); // Ensure app.js exports the Express app
const { sequelize, User } = require('../models');

beforeAll(async () => {
  // Sync database and force-drop all tables before tests (use a test DB)
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  // Close the database connection after tests
  await sequelize.close();
});

describe('Authentication Endpoints', () => {
  let token;

  test('POST /auth/signup - should create a new user', async () => {
    const res = await request(app)
      .post('/auth/signup')
      .send({
        username: "testuser",
        email: "test@example.com",
        password: "testpassword",
        name: "Test User"
      })
      .set('Content-Type', 'application/json');
      
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toBe("User created successfully");
  });

  test('POST /auth/login - should return a JWT token for valid credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: "test@example.com",
        password: "testpassword"
      })
      .set('Content-Type', 'application/json');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token; // Save token for subsequent tests
  });

  test('GET /profile - should retrieve the authenticated user profile', async () => {
    const res = await request(app)
      .get('/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('email', 'test@example.com');
    expect(res.body).not.toHaveProperty('passwordHash');
  });
});

// You can add more tests for endpoints like /expenses, /budget, /rewards, and /sustainability/compute as needed.
