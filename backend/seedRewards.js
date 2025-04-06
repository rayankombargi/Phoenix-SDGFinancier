const { sequelize, Reward } = require('./models');

(async () => {
  try {
    console.log('Syncing database (this will drop and recreate tables)...');
    await sequelize.sync({ force: true });
    console.log('Database synced.');

    await Reward.bulkCreate([
      {
        name: 'Amazon Gift Card',
        points: 500,
        description: 'Redeem for a $5 Amazon gift card.',
        image: 'https://cdn-icons-png.flaticon.com/512/181/181549.png'
      },
      {
        name: 'Starbucks Voucher',
        points: 300,
        description: 'Enjoy a free drink at Starbucks.',
        image: 'https://cdn-icons-png.flaticon.com/512/181/181549.png'
      },
      {
        name: 'Discount Coupon',
        points: 200,
        description: 'Get a discount on your next purchase.',
        image: 'https://cdn-icons-png.flaticon.com/512/181/181549.png'
      },
    ]);

    console.log('✅ Rewards seeded successfully!');
  } catch (error) {
    console.error('Error seeding rewards:', error);
  } finally {
    process.exit();
  }
})();
