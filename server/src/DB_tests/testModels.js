require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Part = require('../models/Part');
const Review = require('../models/Review');

const testModels = async () => {
  try {
    // Connect to DB
    await connectDB();

    console.log('\n🧪 Testing User Model...');
    const testUser = await User.create({
      username: 'testuser123',
      email: 'test@example.com',
      password: 'password123',
    });
    console.log('✅ User created:', testUser.username);

    console.log('\n🧪 Testing Part Model...');
    const testPart = await Part.create({
      name: 'AMD Ryzen 9 7950X',
      category: 'CPU',
      manufacturer: 'AMD',
      price: 699.99,
      specifications: {
        cores: '16',
        threads: '32',
        baseClock: '4.5 GHz',
      },
    });
    console.log('✅ Part created:', testPart.name);

    console.log('\n🧪 Testing Review Model...');
    const testReview = await Review.create({
      user: testUser._id,
      part: testPart._id,
      rating: 5,
      comment: 'Excellent CPU for gaming and productivity tasks!',
    });
    console.log('✅ Review created with rating:', testReview.rating);

    console.log('\n🧪 Testing Relationships...');
    const populatedReview = await Review.findById(testReview._id)
      .populate('user', 'username email')
      .populate('part', 'name category');
    console.log('✅ Populated Review:', {
      reviewer: populatedReview.user.username,
      partReviewed: populatedReview.part.name,
      rating: populatedReview.rating,
    });

    console.log('\n🧹 Cleaning up test data...');
    await User.deleteMany({ email: 'test@example.com' });
    await Part.deleteMany({ name: 'AMD Ryzen 9 7950X' });
    await Review.deleteMany({ rating: 5 });
    console.log('✅ Test data cleaned up');

    console.log('\n✅ All models tested successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
};

testModels();
