const mongoose = require('../backend/node_modules/mongoose');
const fs = require('fs');
const path = require('path');
require('../backend/node_modules/dotenv').config({ path: path.join(__dirname, '../backend/.env') });

// Importar modelos
const User = require('../backend/src/models/User');
const Company = require('../backend/src/models/Company');
const UserCompany = require('../backend/src/models/UserCompany');
const AccountCatalog = require('../backend/src/models/AccountCatalog');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/siaff-db';

async function importDatabase(filePath) {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado exitosamente');

    // Verificar que el archivo existe
    if (!fs.existsSync(filePath)) {
      throw new Error(`Archivo no encontrado: ${filePath}`);
    }

    console.log(`\n📂 Leyendo archivo: ${filePath}`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    console.log(`📊 Información del backup:`);
    console.log(`   Fecha: ${data.exportDate}`);
    console.log(`   Versión: ${data.version}`);
    console.log(`   Base de datos: ${data.database}`);

    // Confirmar antes de proceder
    console.log('\n⚠️  ADVERTENCIA: Esta operación eliminará todos los datos existentes');
    console.log('   Presiona Ctrl+C para cancelar o espera 5 segundos para continuar...');
    
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('\n🗑️  Limpiando colecciones existentes...');
    await User.deleteMany({});
    await Company.deleteMany({});
    await UserCompany.deleteMany({});
    await AccountCatalog.deleteMany({});
    console.log('   ✅ Colecciones limpiadas');

    console.log('\n📥 Importando colecciones...');

    // Importar Users
    if (data.collections.users && data.collections.users.length > 0) {
      await User.insertMany(data.collections.users);
      console.log(`   ✅ Users: ${data.collections.users.length} documentos`);
    }

    // Importar Companies
    if (data.collections.companies && data.collections.companies.length > 0) {
      await Company.insertMany(data.collections.companies);
      console.log(`   ✅ Companies: ${data.collections.companies.length} documentos`);
    }

    // Importar UserCompanies
    if (data.collections.userCompanies && data.collections.userCompanies.length > 0) {
      await UserCompany.insertMany(data.collections.userCompanies);
      console.log(`   ✅ UserCompanies: ${data.collections.userCompanies.length} documentos`);
    }

    // Importar AccountCatalogs
    if (data.collections.accountCatalogs && data.collections.accountCatalogs.length > 0) {
      await AccountCatalog.insertMany(data.collections.accountCatalogs);
      console.log(`   ✅ AccountCatalogs: ${data.collections.accountCatalogs.length} documentos`);
    }

    console.log('\n✅ Base de datos importada exitosamente');
    console.log(`📊 Total documentos importados: ${data.stats.totalUsers + data.stats.totalCompanies + data.stats.totalUserCompanies + data.stats.totalAccountCatalogs}`);

    await mongoose.connection.close();
    console.log('\n🔌 Desconectado de MongoDB');

  } catch (error) {
    console.error('❌ Error al importar la base de datos:', error);
    process.exit(1);
  }
}

// Obtener ruta del archivo desde argumentos
const filePath = process.argv[2] || path.join(__dirname, 'backups', 'siaff-db-latest.json');
importDatabase(filePath);
