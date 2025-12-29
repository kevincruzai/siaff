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
const EXPORT_DIR = path.join(__dirname, 'backups');

async function exportDatabase() {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado exitosamente');

    // Crear directorio de backup si no existe
    if (!fs.existsSync(EXPORT_DIR)) {
      fs.mkdirSync(EXPORT_DIR, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const exportPath = path.join(EXPORT_DIR, `siaff-db-${timestamp}.json`);

    console.log('\n📦 Exportando colecciones...');

    // Exportar cada colección
    const users = await User.find({}).lean();
    console.log(`   ✅ Users: ${users.length} documentos`);

    const companies = await Company.find({}).lean();
    console.log(`   ✅ Companies: ${companies.length} documentos`);

    const userCompanies = await UserCompany.find({}).lean();
    console.log(`   ✅ UserCompanies: ${userCompanies.length} documentos`);

    const accountCatalogs = await AccountCatalog.find({}).lean();
    console.log(`   ✅ AccountCatalogs: ${accountCatalogs.length} documentos`);

    // Crear objeto de exportación
    const exportData = {
      exportDate: new Date().toISOString(),
      version: '2.0.0-multitenant',
      database: 'siaff-db',
      collections: {
        users,
        companies,
        userCompanies,
        accountCatalogs,
      },
      stats: {
        totalUsers: users.length,
        totalCompanies: companies.length,
        totalUserCompanies: userCompanies.length,
        totalAccountCatalogs: accountCatalogs.length,
      },
    };

    // Guardar a archivo JSON
    fs.writeFileSync(exportPath, JSON.stringify(exportData, null, 2));

    console.log(`\n✅ Base de datos exportada exitosamente`);
    console.log(`📁 Archivo: ${exportPath}`);
    console.log(`📊 Total documentos: ${users.length + companies.length + userCompanies.length + accountCatalogs.length}`);

    // También crear una copia "latest"
    const latestPath = path.join(EXPORT_DIR, 'siaff-db-latest.json');
    fs.copyFileSync(exportPath, latestPath);
    console.log(`📁 Copia latest: ${latestPath}`);

    await mongoose.connection.close();
    console.log('\n🔌 Desconectado de MongoDB');

  } catch (error) {
    console.error('❌ Error al exportar la base de datos:', error);
    process.exit(1);
  }
}

// Ejecutar exportación
exportDatabase();
