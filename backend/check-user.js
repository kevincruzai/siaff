const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Company = require('./src/models/Company');
const UserCompany = require('./src/models/UserCompany');

dotenv.config();

const checkUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🍃 Connected to MongoDB');

    // Buscar usuario específico
    const user = await User.findOne({ email: 'ceo@holding.com' });
    
    if (!user) {
      console.log('❌ Usuario no encontrado con email: ceo@holding.com');
      
      // Listar todos los usuarios
      const allUsers = await User.find({}, 'email name');
      console.log('👥 Usuarios en la base de datos:');
      allUsers.forEach(u => console.log(`   - ${u.email} (${u.name})`));
      
    } else {
      console.log('✅ Usuario encontrado:', {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
        globalRole: user.globalRole
      });

      // Buscar empresas del usuario
      const userCompanies = await UserCompany.getUserCompanies(user._id);
      console.log(`🏢 Empresas del usuario (${userCompanies.length}):`);
      userCompanies.forEach(uc => {
        console.log(`   - ${uc.company.name} (${uc.role}) - Status: ${uc.status}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

checkUser();