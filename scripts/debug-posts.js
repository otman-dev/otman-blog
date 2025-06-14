const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://rasmus:wordpiss@adro.ddns.net:27017/';
const DB_NAME = 'otman-blog';

async function debugPosts() {
  let client;
  
  try {
    console.log('Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connected successfully');
    
    const db = client.db(DB_NAME);
    const postsCollection = db.collection('posts');
    
    console.log('\n=== All Posts Debug Info ===');
    const posts = await postsCollection.find({}).toArray();
    console.log(`Total posts found: ${posts.length}`);
    
    posts.forEach((post, index) => {
      console.log(`\n--- Post ${index + 1} ---`);
      console.log('_id:', post._id);
      console.log('id:', post.id);
      console.log('title:', post.title);
      console.log('published:', post.published);
      console.log('Has custom id field:', !!post.id);
      console.log('_id type:', typeof post._id);
      console.log('_id toString:', post._id.toString());
      
      if (post.id) {
        console.log('Custom id type:', typeof post.id);
        console.log('Custom id length:', post.id.length);
      }
    });
    
    console.log('\n=== Test Query Results ===');
    
    // Test with first post's _id
    if (posts.length > 0) {
      const firstPost = posts[0];
      console.log(`\nTesting queries for first post: "${firstPost.title}"`);
      
      // Test 1: Query by _id ObjectId
      console.log('\n1. Query by _id ObjectId:');
      const result1 = await postsCollection.findOne({ _id: firstPost._id });
      console.log('Found:', !!result1);
      
      // Test 2: Query by _id string
      console.log('\n2. Query by _id string:');
      const result2 = await postsCollection.findOne({ _id: firstPost._id.toString() });
      console.log('Found:', !!result2);
      
      // Test 3: Query by custom id (if exists)
      if (firstPost.id) {
        console.log('\n3. Query by custom id:');
        const result3 = await postsCollection.findOne({ id: firstPost.id });
        console.log('Found:', !!result3);
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('\nConnection closed');
    }
  }
}

debugPosts();
