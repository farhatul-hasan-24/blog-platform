const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blog_platform');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    
    if (adminExists) {
      console.log('✅ Database already has data. Skipping seed to prevent data loss.');
      console.log('Admin account exists:', adminExists.email);
      await mongoose.connection.close();
      process.exit(0);
    }

    console.log('📝 Database is empty. Seeding test users...');

    // Create test users (only if database is empty)
    const testUsers = [
      {
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
      },
      {
        username: 'user',
        email: 'user@example.com',
        password: 'user123',
        role: 'user'
      },
      {
        username: 'hasan',
        email: 'hasan@example.com',
        password: 'hasan123',
        role: 'user'
      }
    ];

    const createdUsers = await User.create(testUsers);
    console.log(`✅ Created ${createdUsers.length} test users:`);
    createdUsers.forEach(user => {
      console.log(`   - ${user.email} (${user.role})`);
    });

    await mongoose.connection.close();
    console.log('Database seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
