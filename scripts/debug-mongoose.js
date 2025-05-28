require('dotenv').config({ path: '.env.local' });

const mongoose = require('mongoose');
const models = require('./mongoose-models');
const { connectToMongoose, Category, Tag, Post, User, EmailSubscription } = models;

async function debugMongooseDatabase() {
  try {
    // Connect to database
    await connectToMongoose();
    
    console.log('\n=== MONGOOSE MODELS TEST ===');
    console.log('Connected to MongoDB with Mongoose!');

    // Sample operations
    const categoryCount = await Category.countDocuments();
    const tagCount = await Tag.countDocuments();
    const postCount = await Post.countDocuments();
    const userCount = await User.countDocuments();
    const subscriptionCount = await EmailSubscription.countDocuments();

    console.log('\nDatabase Statistics:');
    console.log(`- Categories: ${categoryCount}`);
    console.log(`- Tags: ${tagCount}`);
    console.log(`- Posts: ${postCount}`);
    console.log(`- Users: ${userCount}`);
    console.log(`- Email Subscriptions: ${subscriptionCount}`);

    // Get a sample from each collection (if available)
    if (categoryCount > 0) {
      const sampleCategory = await Category.findOne().lean();
      console.log('\nSample Category:', sampleCategory?.name);
    }

    if (postCount > 0) {
      const samplePost = await Post.findOne().lean();
      console.log('Sample Post:', samplePost?.title);
    }

    console.log('\nMongoose models are working correctly!');
  } catch (error) {
    console.error('Error debugging database:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the function
debugMongooseDatabase();
