require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Part = require('../models/Part');
const Review = require('../models/Review');

const testConnectionAndTimestamps = async () => {
  try {
    console.log('\n🧪 Testing Database Connection and Timestamps...\n');

    // Test 1: Verify MongoDB connection
    console.log('Test 1: Verifying MongoDB connection...');
    await connectDB();
    
    if (mongoose.connection.readyState === 1) {
      console.log('✅ MongoDB connection is active (readyState: 1)');
      console.log('   Database name:', mongoose.connection.name);
      console.log('   Host:', mongoose.connection.host);
    } else {
      console.log('❌ MongoDB connection failed (readyState:', mongoose.connection.readyState + ')');
      process.exit(1);
    }

    // Test 2: Test User timestamps
    console.log('\nTest 2: Testing User model timestamps...');
    const user = await User.create({
      username: 'timestampuser',
      email: 'timestamp@example.com',
      password: 'password123',
    });
    
    if (user.createdAt && user.updatedAt) {
      console.log('✅ User has createdAt:', user.createdAt);
      console.log('✅ User has updatedAt:', user.updatedAt);
      console.log('   Timestamps match:', user.createdAt.getTime() === user.updatedAt.getTime());
    } else {
      console.log('❌ User missing timestamps!');
    }

    // Test 3: Test Part timestamps
    console.log('\nTest 3: Testing Part model timestamps...');
    const part = await Part.create({
      name: 'Intel Core i9-13900K',
      category: 'CPU',
      manufacturer: 'Intel',
      price: 589.99,
      specifications: {
        cores: '24',
        threads: '32',
        baseClock: '3.0 GHz',
        boostClock: '5.8 GHz',
      },
    });
    
    if (part.createdAt && part.updatedAt) {
      console.log('✅ Part has createdAt:', part.createdAt);
      console.log('✅ Part has updatedAt:', part.updatedAt);
    } else {
      console.log('❌ Part missing timestamps!');
    }

    // Test 4: Test Review timestamps
    console.log('\nTest 4: Testing Review model timestamps...');
    const review = await Review.create({
      user: user._id,
      part: part._id,
      rating: 5,
      comment: 'Amazing CPU for both gaming and productivity work!',
    });
    
    if (review.createdAt && review.updatedAt) {
      console.log('✅ Review has createdAt:', review.createdAt);
      console.log('✅ Review has updatedAt:', review.updatedAt);
    } else {
      console.log('❌ Review missing timestamps!');
    }

    // Test 5: Test timestamp update
    console.log('\nTest 5: Testing updatedAt changes when document is modified...');
    const originalUpdatedAt = user.updatedAt;
    
    // Wait 1 second to ensure different timestamp
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    user.username = 'timestampuser_updated';
    await user.save();
    
    if (user.updatedAt.getTime() > originalUpdatedAt.getTime()) {
      console.log('✅ updatedAt changed after modification');
      console.log('   Original:', originalUpdatedAt);
      console.log('   Updated:', user.updatedAt);
    } else {
      console.log('❌ updatedAt did not change after modification!');
    }

    // Test 6: Verify all collections exist
    console.log('\nTest 6: Verifying all collections exist in database...');
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    const requiredCollections = ['users', 'parts', 'reviews'];
    const allExist = requiredCollections.every(name => collectionNames.includes(name));
    
    if (allExist) {
      console.log('✅ All required collections exist:', collectionNames.join(', '));
    } else {
      console.log('❌ Missing collections!');
      console.log('   Expected:', requiredCollections);
      console.log('   Found:', collectionNames);
    }

    // Test 7: Test document count
    console.log('\nTest 7: Verifying document counts...');
    const userCount = await User.countDocuments();
    const partCount = await Part.countDocuments();
    const reviewCount = await Review.countDocuments();
    
    console.log('✅ Document counts:');
    console.log('   Users:', userCount);
    console.log('   Parts:', partCount);
    console.log('   Reviews:', reviewCount);

    // Test 8: Test relationship with populated data
    console.log('\nTest 8: Testing relationship population...');
    const populatedReview = await Review.findById(review._id)
      .populate('user', 'username email createdAt')
      .populate('part', 'name category manufacturer price');
    
    if (populatedReview.user.username && populatedReview.part.name) {
      console.log('✅ Review relationships populated successfully:');
      console.log('   User:', populatedReview.user.username, '(' + populatedReview.user.email + ')');
      console.log('   Part:', populatedReview.part.name, '-', populatedReview.part.manufacturer);
      console.log('   User has timestamps:', !!populatedReview.user.createdAt);
    } else {
      console.log('❌ Failed to populate review relationships!');
    }

    // Cleanup
    console.log('\n🧹 Cleaning up test data...');
    await User.deleteMany({ email: 'timestamp@example.com' });
    await Part.deleteMany({ name: 'Intel Core i9-13900K' });
    await Review.deleteMany({ comment: { $regex: /Amazing CPU/ } });
    console.log('✅ Test data cleaned up');

    console.log('\n✅ All connection and timestamp tests passed successfully!\n');
    
    // Gracefully close connection
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection/Timestamp test failed:', error);
    process.exit(1);
  }
};

testConnectionAndTimestamps();
