const mongoose = require('mongoose');
const User = require('./src/models/User');

async function connectDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/siaff-db');
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
}

async function checkAdminUser() {
  try {
    await connectDB();
    
    const adminUser = await User.findOne({ email: 'admin@siaff.net' }).select('+password');
    
    if (!adminUser) {
      console.log('❌ Admin user not found');
      return;
    }
    
    console.log('👤 Admin User Found:');
    console.log('- Name:', adminUser.name);
    console.log('- Email:', adminUser.email);
    console.log('- Global Role:', adminUser.globalRole);
    console.log('- Status:', adminUser.status);
    console.log('- Created:', adminUser.createdAt);
    
    // Test common passwords
    const testPasswords = ['admin123', 'password', 'admin', '123456', 'siaff123'];
    
    for (const pwd of testPasswords) {
      const isCorrect = await adminUser.correctPassword(pwd, adminUser.password);
      console.log(`🔑 Password "${pwd}": ${isCorrect ? '✅ CORRECT' : '❌ Wrong'}`);
      if (isCorrect) break;
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkAdminUser();