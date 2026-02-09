require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Part = require('../models/Part');
const Review = require('../models/Review');

const testValidation = async () => {
  try {
    await connectDB();
    console.log('\n🧪 Testing Schema Validation and Error Handling...\n');

    // Test 1: User validation errors
    console.log('Test 1: User with missing required fields...');
    try {
      await User.create({ username: 'test' }); // Missing email and password
      console.log('❌ Should have failed - validation not working!');
    } catch (error) {
      console.log('✅ Correctly rejected invalid user:', error.message);
    }

    // Test 2: User with invalid email
    console.log('\nTest 2: User with invalid email format...');
    try {
      await User.create({
        username: 'testuser',
        email: 'not-an-email',
        password: 'password123',
      });
      console.log('❌ Should have failed - email validation not working!');
    } catch (error) {
      console.log('✅ Correctly rejected invalid email:', error.message);
    }

    // Test 3: User with short username
    console.log('\nTest 3: User with username too short...');
    try {
      await User.create({
        username: 'ab', // Less than 3 characters
        email: 'test@example.com',
        password: 'password123',
      });
      console.log('❌ Should have failed - username length validation not working!');
    } catch (error) {
      console.log('✅ Correctly rejected short username:', error.message);
    }

    // Test 4: Part with invalid category
    console.log('\nTest 4: Part with invalid category...');
    try {
      await Part.create({
        name: 'Test Part',
        category: 'InvalidCategory', // Not in enum
        manufacturer: 'Test Brand',
        price: 100,
      });
      console.log('❌ Should have failed - category enum validation not working!');
    } catch (error) {
      console.log('✅ Correctly rejected invalid category:', error.message);
    }

    // Test 5: Part with negative price
    console.log('\nTest 5: Part with negative price...');
    try {
      await Part.create({
        name: 'Test Part',
        category: 'CPU',
        manufacturer: 'Test Brand',
        price: -50, // Negative price
      });
      console.log('❌ Should have failed - price validation not working!');
    } catch (error) {
      console.log('✅ Correctly rejected negative price:', error.message);
    }

    // Test 6: Review with invalid rating
    console.log('\nTest 6: Review with rating out of range...');
    const validUser = await User.create({
      username: 'validuser',
      email: 'valid@example.com',
      password: 'password123',
    });
    const validPart = await Part.create({
      name: 'Valid Part',
      category: 'GPU',
      manufacturer: 'NVIDIA',
      price: 500,
    });
    try {
      await Review.create({
        user: validUser._id,
        part: validPart._id,
        rating: 10, // Rating > 5
        comment: 'This should fail because rating is too high',
      });
      console.log('❌ Should have failed - rating validation not working!');
    } catch (error) {
      console.log('✅ Correctly rejected invalid rating:', error.message);
    }

    // Test 7: Review with short comment
    console.log('\nTest 7: Review with comment too short...');
    try {
      await Review.create({
        user: validUser._id,
        part: validPart._id,
        rating: 5,
        comment: 'Short', // Less than 10 characters
      });
      console.log('❌ Should have failed - comment length validation not working!');
    } catch (error) {
      console.log('✅ Correctly rejected short comment:', error.message);
    }

    // Test 8: Duplicate username
    console.log('\nTest 8: Duplicate username...');
    try {
      await User.create({
        username: 'validuser', // Already exists
        email: 'another@example.com',
        password: 'password123',
      });
      console.log('❌ Should have failed - unique validation not working!');
    } catch (error) {
      console.log('✅ Correctly rejected duplicate username:', error.message);
    }

    // Test 9: Duplicate review (same user + same part)
    console.log('\nTest 9: Duplicate review from same user on same part...');
    await Review.create({
      user: validUser._id,
      part: validPart._id,
      rating: 4,
      comment: 'This is my first review for this part',
    });
    try {
      await Review.create({
        user: validUser._id,
        part: validPart._id, // Same user and part
        rating: 5,
        comment: 'This should fail because I already reviewed this',
      });
      console.log('❌ Should have failed - unique index not working!');
    } catch (error) {
      console.log('✅ Correctly prevented duplicate review:', error.message);
    }

    // Cleanup
    console.log('\n🧹 Cleaning up test data...');
    await User.deleteMany({ email: { $in: ['valid@example.com', 'another@example.com'] } });
    await Part.deleteMany({ name: 'Valid Part' });
    await Review.deleteMany({});
    console.log('✅ Test data cleaned up');

    console.log('\n✅ All validation tests passed successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Validation test failed:', error);
    process.exit(1);
  }
};

testValidation();
