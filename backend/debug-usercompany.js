const mongoose = require('mongoose');
const User = require('./src/models/User');
const UserCompany = require('./src/models/UserCompany');
const Company = require('./src/models/Company');

// Conectar a la base de datos
async function connectDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/siaff-db', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
}

async function debugUserCompany() {
  try {
    await connectDB();

    console.log('\n=== Verificando colecciones ===');
    
    // Verificar Users
    const usersCount = await User.countDocuments();
    console.log(`📊 Total Users: ${usersCount}`);
    
    const sampleUser = await User.findOne().select('name email globalRole');
    console.log('👤 Sample User:', sampleUser);

    // Verificar Companies
    const companiesCount = await Company.countDocuments();
    console.log(`🏢 Total Companies: ${companiesCount}`);
    
    const sampleCompany = await Company.findOne().select('name displayName');
    console.log('🏢 Sample Company:', sampleCompany);

    // Verificar UserCompany
    const userCompaniesCount = await UserCompany.countDocuments();
    console.log(`🔗 Total UserCompanies: ${userCompaniesCount}`);
    
    const sampleUserCompany = await UserCompany.findOne().populate('user', 'name email').populate('company', 'name displayName');
    console.log('🔗 Sample UserCompany:', JSON.stringify(sampleUserCompany, null, 2));

    // Probar la agregación del admin
    console.log('\n=== Probando agregación admin ===');
    const aggregationResult = await UserCompany.aggregate([
      { $match: {} }, // Sin filtros para ver todos
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      {
        $lookup: {
          from: 'companies',
          localField: 'company',
          foreignField: '_id',
          as: 'companyInfo'
        }
      },
      { $unwind: '$userInfo' },
      { $unwind: '$companyInfo' },
      { $limit: 3 } // Solo los primeros 3
    ]);

    console.log(`🔍 Resultados de agregación: ${aggregationResult.length}`);
    aggregationResult.forEach((result, index) => {
      console.log(`\nResultado ${index + 1}:`);
      console.log('- UserInfo:', {
        name: result.userInfo?.name,
        email: result.userInfo?.email,
        globalRole: result.userInfo?.globalRole
      });
      console.log('- CompanyInfo:', {
        name: result.companyInfo?.name,
        displayName: result.companyInfo?.displayName
      });
      console.log('- Role:', result.role);
      console.log('- Status:', result.status);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

debugUserCompany();