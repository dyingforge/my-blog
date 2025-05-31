require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('Attempting to connect to MongoDB...');
    
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is not defined in environment variables');
      process.exit(1);
    }
    
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'my-blog',
    });
    
    console.log('✅ Successfully connected to MongoDB!');
    await mongoose.connection.close();
    console.log('Connection closed.');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
  } finally {
    process.exit(0);
  }
}

testConnection();