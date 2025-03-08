jest.setTimeout(30000); // Increase timeout for database operations

const request = require('supertest');
const app = require('../app'); // Ensure app.js exports the Express app instance
const { 
  sequelize, 
  Category, 
  SustainabilityFactor, 
  SustainabilityQuestion, 
  ExpenseAnswer 
} = require('../models');

beforeAll(async () => {
  // Sync database and force-drop tables for a clean slate in tests.
  await sequelize.sync({ force: true });
  
  // Seed required data with multiple categories:

  // Food & Dining category
  const foodCategory = await Category.create({
    name: 'Food & Dining',
    description: 'Expenses for food, restaurants, groceries, etc.'
  });
  await SustainabilityFactor.create({
    category_id: foodCategory.id,
    co2_factor: 0.5,
    water_usage_factor: 0.3,
    renewable_percentage: 40.0
  });

  // Utilities category
  const utilitiesCategory = await Category.create({
    name: 'Utilities',
    description: 'Expenses for electricity, water, gas, etc.'
  });
  await SustainabilityFactor.create({
    category_id: utilitiesCategory.id,
    co2_factor: 0.2,
    water_usage_factor: 0.1,
    renewable_percentage: 50.0
  });

  // Entertainment category
  const entertainmentCategory = await Category.create({
    name: 'Entertainment',
    description: 'Expenses for movies, games, concerts, etc.'
  });
  await SustainabilityFactor.create({
    category_id: entertainmentCategory.id,
    co2_factor: 0.3,
    water_usage_factor: 0.2,
    renewable_percentage: 30.0
  });

  // Transportation category
  const transportationCategory = await Category.create({
    name: 'Transportation',
    description: 'Expenses for public transit, fuel, ridesharing, etc.'
  });
  await SustainabilityFactor.create({
    category_id: transportationCategory.id,
    co2_factor: 0.7,
    water_usage_factor: 0.4,
    renewable_percentage: 20.0
  });
  
  // --- Seed normalized sustainability questions for each category ---
  // For demonstration, we'll seed questions only for "Food & Dining".
  const foodQuestions = [
    {
      question_text: 'Is the food organic?',
      possible_answers: { "Yes": 0.8, "No": 1.0 }
    },
    {
      question_text: 'Is the food locally sourced?',
      possible_answers: { "Yes": 0.9, "No": 1.0 }
    },
    {
      question_text: 'Did you dine at a sustainable restaurant?',
      possible_answers: { "Yes": 0.85, "No": 1.0 }
    }
  ];
  
  for (const q of foodQuestions) {
    await SustainabilityQuestion.create({
      category_id: foodCategory.id,
      question_text: q.question_text,
      possible_answers: q.possible_answers,
    });
  }
});

afterAll(async () => {
  await sequelize.close();
});

describe('Authentication Endpoints', () => {
  let token;
  test('POST /auth/signup - should create a new user', async () => {
    const res = await request(app)
      .post('/auth/signup')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpassword',
        name: 'Test User'
      })
      .set('Content-Type', 'application/json');
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('User created successfully');
  });

  // Removed invalid email test

  test('POST /auth/login - should return a JWT token for valid credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'testpassword'
      })
      .set('Content-Type', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  test('POST /auth/login - should fail for wrong password', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword'
      })
      .set('Content-Type', 'application/json');
    expect(res.statusCode).toBe(401);
  });

  test('GET /profile - should retrieve the authenticated user profile', async () => {
    const res = await request(app)
      .get('/profile')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe('test@example.com');
    expect(res.body).not.toHaveProperty('passwordHash');
  });
});

describe('Expense Endpoints', () => {
  let token;
  let expenseId;

  beforeAll(async () => {
    // Create a new user for expense tests.
    await request(app)
      .post('/auth/signup')
      .send({
        username: 'expenseTester',
        email: 'expense@test.com',
        password: 'testpassword',
        name: 'Expense Tester'
      })
      .set('Content-Type', 'application/json');
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'expense@test.com',
        password: 'testpassword'
      })
      .set('Content-Type', 'application/json');
    token = res.body.token;
  });

  test.each([
    { date: '2025-03-01', name: 'Lunch', cost: '12.50', category: 'Food & Dining' },
    { date: '2025-03-02', name: 'Dinner', cost: '25.00', category: 'Food & Dining' },
    { date: '2025-03-03', name: 'Snack', cost: '5.00', category: 'Food & Dining' }
  ])('POST /expenses - Create a new expense with data: %o', async (expenseData) => {
    const res = await request(app)
      .post('/expenses')
      .set('Authorization', `Bearer ${token}`)
      .send(expenseData)
      .set('Content-Type', 'application/json');
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expenseId = res.body.id;
  });

  test('POST /expenses - should fail if category does not exist', async () => {
    const res = await request(app)
      .post('/expenses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        date: '2025-03-04',
        name: 'Invalid Expense',
        cost: '10.00',
        category: 'NonExistent'
      })
      .set('Content-Type', 'application/json');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Category not found');
  });

  test('GET /expenses - Retrieve expenses', async () => {
    const res = await request(app)
      .get('/expenses')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('PUT /expenses/:id - Update an expense', async () => {
    const res = await request(app)
      .put(`/expenses/${expenseId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        date: '2025-03-05',
        name: 'Updated Lunch',
        cost: '15.00',
        category: 'Food & Dining'
      })
      .set('Content-Type', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Updated Lunch');
  });

  test('DELETE /expenses/:id - Delete an expense', async () => {
    const res = await request(app)
      .delete(`/expenses/${expenseId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Expense deleted');
  });

  test('Expense lifecycle: create, update, delete and verify state', async () => {
    const expensesData = [
      { date: '2025-04-01', name: 'Breakfast', cost: '8.00', category: 'Food & Dining' },
      { date: '2025-04-01', name: 'Lunch', cost: '15.00', category: 'Food & Dining' }
    ];
    const createdExpenses = await Promise.all(expensesData.map(async (data) => {
      const res = await request(app)
        .post('/expenses')
        .set('Authorization', `Bearer ${token}`)
        .send(data)
        .set('Content-Type', 'application/json');
      return res.body;
    }));
    const updateRes = await request(app)
      .put(`/expenses/${createdExpenses[0].id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        date: '2025-04-02',
        name: 'Updated Breakfast',
        cost: '9.00',
        category: 'Food & Dining'
      })
      .set('Content-Type', 'application/json');
    expect(updateRes.statusCode).toBe(200);
    const deleteRes = await request(app)
      .delete(`/expenses/${createdExpenses[1].id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(deleteRes.statusCode).toBe(200);
    const finalRes = await request(app)
      .get('/expenses')
      .set('Authorization', `Bearer ${token}`);
    expect(finalRes.body.find(exp => exp.id === createdExpenses[0].id).name).toBe('Updated Breakfast');
  });
});

describe('Budget Endpoints', () => {
  let token;
  beforeAll(async () => {
    await request(app)
      .post('/auth/signup')
      .send({
        username: 'budgetTester',
        email: 'budget@test.com',
        password: 'testpassword',
        name: 'Budget Tester'
      })
      .set('Content-Type', 'application/json');
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'budget@test.com',
        password: 'testpassword'
      })
      .set('Content-Type', 'application/json');
    token = res.body.token;
  });

  test('GET /budget - Retrieve budgets for a given month/year', async () => {
    const res = await request(app)
      .get('/budget?month=3&year=2025')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test.each([
    { month: 3, year: 2025, budgets: [{ category: 'Food & Dining', limit: '300.00' }] },
    { month: 4, year: 2025, budgets: [{ category: 'Food & Dining', limit: '350.00' }, { category: 'Utilities', limit: '150.00' }] }
  ])('PUT /budget - Update or create budgets with payload: %j', async (payload) => {
    const res = await request(app)
      .put('/budget')
      .set('Authorization', `Bearer ${token}`)
      .send(payload)
      .set('Content-Type', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(payload.budgets.length);
  });

  test('PUT /budget - should fail with invalid month (e.g., month 0)', async () => {
    const res = await request(app)
      .put('/budget')
      .set('Authorization', `Bearer ${token}`)
      .send({
        month: 0,
        year: 2025,
        budgets: [{ category: 'Food & Dining', limit: '300.00' }]
      })
      .set('Content-Type', 'application/json');
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });
});

describe('Reward Endpoints', () => {
  let token;
  beforeAll(async () => {
    await request(app)
      .post('/auth/signup')
      .send({
        username: 'rewardTester',
        email: 'reward@test.com',
        password: 'testpassword',
        name: 'Reward Tester'
      })
      .set('Content-Type', 'application/json');
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'reward@test.com',
        password: 'testpassword'
      })
      .set('Content-Type', 'application/json');
    token = res.body.token;
  });

  test('POST /rewards - Create a reward event', async () => {
    const res = await request(app)
      .post('/rewards')
      .set('Authorization', `Bearer ${token}`)
      .send({
        type: 'Eco Points',
        points: 50,
        date: new Date().toISOString()
      })
      .set('Content-Type', 'application/json');
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  test('GET /rewards/total - Retrieve total reward points', async () => {
    const res = await request(app)
      .get('/rewards/total')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('totalPoints');
  });
});

describe('Sustainability Endpoints', () => {
  let token;
  beforeAll(async () => {
    await request(app)
      .post('/auth/signup')
      .send({
        username: 'sustainTester',
        email: 'sustain@test.com',
        password: 'testpassword',
        name: 'Sustain Tester'
      })
      .set('Content-Type', 'application/json');
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'sustain@test.com',
        password: 'testpassword'
      })
      .set('Content-Type', 'application/json');
    token = res.body.token;
  });

  test('GET /sustainability - Retrieve sustainability metrics', async () => {
    const res = await request(app)
      .get('/sustainability')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('sustainabilityScore');
  });

  test('PUT /sustainability - Update sustainability metrics manually', async () => {
    const res = await request(app)
      .put('/sustainability')
      .set('Authorization', `Bearer ${token}`)
      .send({
        sustainabilityScore: 85,
        ecoPoints: 200
      })
      .set('Content-Type', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(res.body.sustainabilityScore).toBe(85);
    expect(res.body.ecoPoints).toBe(200);
  });

  test('POST /sustainability/compute - Compute sustainability metrics based on expenses with normalized answers', async () => {
    // Create an expense in Food & Dining with basic details.
    const expenseRes = await request(app)
      .post('/expenses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        date: '2025-03-10',
        name: 'Dinner',
        cost: '20.00',
        category: 'Food & Dining',
        details: {}  // Leaving details empty to use normalized answers
      })
      .set('Content-Type', 'application/json');
    expect(expenseRes.statusCode).toBe(201);
    const expenseId = expenseRes.body.id;

    // Insert normalized answers for the expense.
    // We'll use the ExpenseAnswer model directly.
    const { ExpenseAnswer, SustainabilityQuestion } = require('../models');
    // Get the two questions for Food & Dining that we seeded earlier.
    const organicQuestion = await SustainabilityQuestion.findOne({ where: { question_text: 'Is the food organic?' } });
    const localQuestion = await SustainabilityQuestion.findOne({ where: { question_text: 'Is the food locally sourced?' } });
    // Insert answers: assume user answered "Yes" for both.
    await ExpenseAnswer.create({
      expense_id: expenseId,
      question_id: organicQuestion.id,
      answer: 'Yes'
    });
    await ExpenseAnswer.create({
      expense_id: expenseId,
      question_id: localQuestion.id,
      answer: 'Yes'
    });

    // Compute sustainability metrics
    const resCompute = await request(app)
      .post('/sustainability/compute')
      .set('Authorization', `Bearer ${token}`);
    expect(resCompute.statusCode).toBe(200);
    expect(resCompute.body).toHaveProperty('sustainabilityScore');
    expect(resCompute.body).toHaveProperty('ecoPoints');
  });
});
