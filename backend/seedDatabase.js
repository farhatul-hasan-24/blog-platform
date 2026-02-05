// Seed Script for Blog Platform
// This script creates test users and posts in the database

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Post = require('./models/Post');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin',
    });
    console.log('✅ Created admin user');

    // Create regular users
    const user1Password = await bcrypt.hash('user123', 10);
    const user1 = await User.create({
      username: 'johndoe',
      email: 'john@example.com',
      password: user1Password,
      role: 'user',
    });

    const user2Password = await bcrypt.hash('user123', 10);
    const user2 = await User.create({
      username: 'janedoe',
      email: 'jane@example.com',
      password: user2Password,
      role: 'user',
    });
    console.log('✅ Created regular users');

    // Create sample posts
    const posts = [
      {
        title: 'Welcome to Our Blog Platform',
        content: 'This is the first post on our amazing blog platform. We are excited to have you here! This platform allows users to create, read, and manage blog posts with role-based access control.',
        author: admin._id,
        authorName: admin.username,
      },
      {
        title: 'Getting Started with Web Development',
        content: 'Web development is an exciting journey. Starting with HTML, CSS, and JavaScript, you can build amazing interactive websites. This blog will help you learn the fundamentals and advanced concepts.',
        author: user1._id,
        authorName: user1.username,
      },
      {
        title: 'The Power of React',
        content: 'React has revolutionized frontend development with its component-based architecture. It makes building complex user interfaces much simpler and more maintainable. Learn React and transform your web development skills!',
        author: user1._id,
        authorName: user1.username,
      },
      {
        title: 'Understanding Node.js',
        content: 'Node.js brings JavaScript to the backend. With its event-driven, non-blocking I/O model, it is perfect for building scalable network applications. Combine it with Express for a powerful backend solution.',
        author: user2._id,
        authorName: user2.username,
      },
      {
        title: 'MongoDB: A NoSQL Database',
        content: 'MongoDB is a document-oriented NoSQL database that stores data in flexible, JSON-like documents. It is perfect for applications that need to scale and handle diverse data types.',
        author: user2._id,
        authorName: user2.username,
      },
      {
        title: 'Authentication and Authorization',
        content: 'Security is crucial in modern web applications. Learn about JWT tokens, password hashing, and role-based access control to build secure applications. This blog platform demonstrates these concepts in action.',
        author: admin._id,
        authorName: admin.username,
      },
    ];

    await Post.insertMany(posts);
    console.log('✅ Created sample posts');

    // Summary
    console.log('\n📊 Database Seeded Successfully!\n');
    console.log('👥 Users Created:');
    console.log('   - Admin: admin@example.com / admin123');
    console.log('   - User 1: john@example.com / user123');
    console.log('   - User 2: jane@example.com / user123');
    console.log(`\n📝 Posts Created: ${posts.length}`);
    console.log('\n✨ You can now start the application and login with these credentials!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
