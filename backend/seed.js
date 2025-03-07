require('dotenv').config();
const { sequelize, User, Expense, Budget, Reward, SustainabilityMetric } = require('./models');

async function seed() {
  try {
    // Sync database; force: true drops tables if they already exist
    await sequelize.sync({ force: true });
    console.log("Database synced successfully.");

    // Create a sample user (password is hashed automatically by the model hook)
    const user = await User.create({
      username: "sampleuser",
      email: "sample@example.com",
      passwordHash: "samplepassword",
      name: "Sample User"
    });
    console.log("Sample user created:", user.id);

    // Create sample expenses for the user
    const expenses = await Expense.bulkCreate([
      { userId: user.id, date: "2025-03-01", name: "Groceries", cost: "50.00", category: "Food & Dining" },
      { userId: user.id, date: "2025-03-02", name: "Electric Bill", cost: "100.00", category: "Utilities" },
      { userId: user.id, date: "2025-03-03", name: "Restaurant", cost: "75.00", category: "Food & Dining" }
    ]);
    console.log("Sample expenses created:", expenses.length);

    // Create sample budget entries for the user for March 2025
    const budgets = await Budget.bulkCreate([
      { userId: user.id, month: 3, year: 2025, category: "Food & Dining", limit: "300.00" },
      { userId: user.id, month: 3, year: 2025, category: "Utilities", limit: "150.00" }
    ]);
    console.log("Sample budgets created:", budgets.length);

    // Create sample reward events for the user
    const rewards = await Reward.bulkCreate([
      { userId: user.id, type: "Eco Points", points: 50, date: new Date() },
      { userId: user.id, type: "Cashback", points: 20, date: new Date() }
    ]);
    console.log("Sample rewards created:", rewards.length);

    // Create a sample sustainability metric for the user
    const sustainability = await SustainabilityMetric.create({
      userId: user.id,
      sustainabilityScore: 85.5,
      ecoPoints: 70,
      lastUpdated: new Date()
    });
    console.log("Sustainability metric created:", sustainability.id);

    console.log("Data seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
}

seed();
