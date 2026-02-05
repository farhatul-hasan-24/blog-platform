const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

/**
 * Safe Seed Script - Only Adds Data, Never Deletes
 * Usage: node addAdmin.js
 * 
 * This script safely adds an admin account without deleting existing data
 */

const addAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blog_platform');
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    
    if (adminExists) {
      console.log('⚠️  Admin account already exists:');
      console.log(`   Email: ${adminExists.email}`);
      console.log(`   Username: ${adminExists.username}`);
      console.log(`   Role: ${adminExists.role}`);
      await mongoose.connection.close();
      process.exit(0);
    }

    // Create admin account
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });

    console.log('✅ Admin account created successfully:');
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Username: ${adminUser.username}`);
    console.log(`   Password: admin123`);
    console.log(`   Role: ${adminUser.role}`);

    await mongoose.connection.close();
    console.log('✅ Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding admin:', error.message);
    process.exit(1);
  }
};

addAdmin();
