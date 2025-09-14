const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User-new');
const Company = require('../models/Company-new');
const UserCompany = require('../models/UserCompany');

// Load environment variables
dotenv.config();

// Connect to database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// Seed super admin
const seedSuperAdmin = async () => {
  try {
    const existingSuperAdmin = await User.findOne({ globalRole: 'super_admin' });
    
    if (existingSuperAdmin) {
      console.log('📋 Super Admin ya existe');
      return existingSuperAdmin;
    }

    // Crear super admin user
    const superAdmin = new User({
      name: 'SIAFF Administrator',
      email: 'admin@siaff.net',
      password: 'admin123',
      username: 'superadmin',
      globalRole: 'super_admin',
      status: 'active',
      preferences: {
        language: 'es',
        timezone: 'America/El_Salvador',
        currency: 'USD'
      },
      hasCompanies: false,
      companies: []
    });

    await superAdmin.save();

    console.log('✅ Super Admin creado exitosamente');
    console.log('   Email: admin@siaff.net');
    console.log('   Password: admin123');

    return superAdmin;

  } catch (error) {
    console.error('❌ Error creando Super Admin:', error);
    throw error;
  }
};

// Seed demo companies and users
const seedDemoData = async () => {
  try {
    const existingCompany = await Company.findOne({ email: 'demo@empresa.com' });
    
    if (existingCompany) {
      console.log('📋 Datos demo ya existen');
      return;
    }

    // Crear empresa demo
    const demoCompany = new Company({
      name: 'Empresa Demo S.A.',
      displayName: 'Empresa Demo',
      email: 'demo@empresa.com',
      phone: '+503 2555-0100',
      industry: 'Comercio',
      address: {
        street: 'Av. Principal #123',
        city: 'San Salvador',
        state: 'San Salvador',
        country: 'El Salvador',
        postalCode: '01101'
      },
      taxId: '0614-123456-123-4',
      subscription: {
        plan: 'Professional',
        status: 'active',
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 año
        maxUsers: 50,
        maxStorageGB: 50
      },
      settings: {
        baseCurrency: 'USD',
        fiscalYearStart: 1,
        timezone: 'America/El_Salvador'
      }
    });

    await demoCompany.save();

    // Crear usuarios demo
    const users = [
      {
        name: 'María Elena Rodríguez',
        email: 'maria@empresa.com',
        password: 'demo123',
        username: 'maria.rodriguez',
        phone: '+503 7555-0101',
        country: 'El Salvador',
        role: 'owner'
      },
      {
        name: 'Carlos Alberto Gómez',
        email: 'carlos@empresa.com',
        password: 'demo123',
        username: 'carlos.gomez',
        phone: '+503 7555-0102',
        country: 'El Salvador',
        role: 'admin'
      },
      {
        name: 'Ana Sofía Martínez',
        email: 'ana@empresa.com',
        password: 'demo123',
        username: 'ana.martinez',
        phone: '+503 7555-0103',
        country: 'El Salvador',
        role: 'accountant'
      },
      {
        name: 'Roberto Jiménez',
        email: 'roberto@empresa.com',
        password: 'demo123',
        username: 'roberto.jimenez',
        phone: '+503 7555-0104',
        country: 'El Salvador',
        role: 'user'
      }
    ];

    for (const userData of users) {
      // Crear usuario
      const user = new User({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        username: userData.username,
        phone: userData.phone,
        country: userData.country,
        status: 'active',
        hasCompanies: true,
        companies: []
      });

      await user.save();

      // Crear relación UserCompany
      const userCompany = new UserCompany({
        user: user._id,
        company: demoCompany._id,
        role: userData.role,
        status: 'active',
        joinedAt: new Date(),
        lastAccessAt: new Date()
      });

      await userCompany.save();

      // Actualizar empresa createdBy con el owner
      if (userData.role === 'owner') {
        demoCompany.createdBy = user._id;
        await demoCompany.save();
      }

      console.log(`👤 Usuario demo creado: ${userData.name} (${userData.role})`);
    }

    console.log('✅ Empresa y usuarios demo creados exitosamente');

    // Crear segunda empresa de ejemplo
    const techCompany = new Company({
      name: 'TechStart SV',
      displayName: 'TechStart El Salvador',
      email: 'info@techstart.sv',
      phone: '+503 2333-4000',
      industry: 'Tecnología',
      address: {
        street: 'Centro Comercial Multiplaza, Local 2-15',
        city: 'Antiguo Cuscatlán',
        state: 'La Libertad',
        country: 'El Salvador',
        postalCode: '01101'
      },
      taxId: '0614-654321-654-1',
      subscription: {
        plan: 'Startup',
        status: 'active',
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 año
        maxUsers: 10,
        maxStorageGB: 5
      },
      settings: {
        baseCurrency: 'USD',
        fiscalYearStart: 1,
        timezone: 'America/El_Salvador'
      }
    });

    await techCompany.save();

    // Crear founder de la empresa tech
    const techFounder = new User({
      name: 'Juan Carlos Pérez',
      email: 'juan@techstart.sv',
      password: 'tech123',
      username: 'juan.perez',
      phone: '+503 7888-0200',
      country: 'El Salvador',
      status: 'active',
      hasCompanies: true,
      companies: []
    });

    await techFounder.save();

    // Crear relación UserCompany para el founder
    const techUserCompany = new UserCompany({
      user: techFounder._id,
      company: techCompany._id,
      role: 'owner',
      status: 'active',
      joinedAt: new Date(),
      lastAccessAt: new Date()
    });

    await techUserCompany.save();

    techCompany.createdBy = techFounder._id;
    await techCompany.save();

    console.log('✅ Segunda empresa demo creada: TechStart SV');

  } catch (error) {
    console.error('❌ Error creando datos demo:', error);
    throw error;
  }
};

// Crear usuario con múltiples empresas (caso real)
const seedMultiCompanyUser = async () => {
  try {
    const existingUser = await User.findOne({ email: 'ceo@holding.com' });
    
    if (existingUser) {
      console.log('📋 Usuario multi-empresa ya existe');
      return;
    }

    // Crear usuario CEO
    const ceoUser = new User({
      name: 'Elena Vásquez',
      email: 'ceo@holding.com',
      password: 'ceo123',
      username: 'elena.vasquez',
      phone: '+503 7999-0001',
      country: 'El Salvador',
      status: 'active',
      hasCompanies: true,
      companies: []
    });

    await ceoUser.save();

    // Crear múltiples empresas
    const companies = [
      {
        name: 'Holding Centroamericano S.A.',
        displayName: 'Holding CA',
        email: 'info@holding.com',
        industry: 'Finanzas',
        plan: 'Enterprise'
      },
      {
        name: 'Constructora del Valle S.A.',
        displayName: 'Constructora Valle',
        email: 'proyectos@valle.com',
        industry: 'Construcción',
        plan: 'Professional'
      },
      {
        name: 'Restaurantes Premium S.A.',
        displayName: 'Premium Restaurants',
        email: 'admin@premium.com',
        industry: 'Servicios',
        plan: 'Startup'
      }
    ];

    for (const companyData of companies) {
      // Crear empresa
      const company = new Company({
        name: companyData.name,
        displayName: companyData.displayName,
        email: companyData.email,
        industry: companyData.industry,
        subscription: {
          plan: companyData.plan,
          status: 'active',
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          maxUsers: companyData.plan === 'Enterprise' ? 200 : companyData.plan === 'Professional' ? 50 : 10,
          maxStorageGB: companyData.plan === 'Enterprise' ? 200 : companyData.plan === 'Professional' ? 50 : 5
        },
        createdBy: ceoUser._id,
        address: {
          country: 'El Salvador'
        }
      });

      await company.save();

      // Crear relación UserCompany
      const userCompany = new UserCompany({
        user: ceoUser._id,
        company: company._id,
        role: 'owner',
        status: 'active',
        joinedAt: new Date(),
        lastAccessAt: new Date()
      });

      await userCompany.save();

      console.log(`🏢 Empresa creada: ${companyData.displayName}`);
    }

    console.log('✅ Usuario con múltiples empresas creado exitosamente');
    console.log('   Email: ceo@holding.com');
    console.log('   Password: ceo123');

  } catch (error) {
    console.error('❌ Error creando usuario multi-empresa:', error);
    throw error;
  }
};

// Función principal de seeding
const runSeeder = async () => {
  try {
    console.log('🌱 Iniciando seeder de base de datos...\n');

    await connectDB();

    console.log('📝 Limpiando datos existentes...');
    await UserCompany.deleteMany({});
    await User.deleteMany({});
    await Company.deleteMany({});

    console.log('👑 Creando Super Admin...');
    await seedSuperAdmin();

    console.log('\n🏢 Creando datos demo...');
    await seedDemoData();

    console.log('\n🎯 Creando usuario multi-empresa...');
    await seedMultiCompanyUser();

    console.log('\n✅ Seeder completado exitosamente!');
    console.log('\n📊 Resumen de datos creados:');
    
    const userCount = await User.countDocuments();
    const companyCount = await Company.countDocuments();
    const relationshipCount = await UserCompany.countDocuments();
    
    console.log(`   - Usuarios: ${userCount}`);
    console.log(`   - Empresas: ${companyCount}`);
    console.log(`   - Relaciones Usuario-Empresa: ${relationshipCount}`);

    console.log('\n🔑 Credenciales de prueba:');
    console.log('   Super Admin: admin@siaff.net / admin123');
    console.log('   Demo Owner: maria@empresa.com / demo123');
    console.log('   Demo Admin: carlos@empresa.com / demo123');
    console.log('   Multi-Company CEO: ceo@holding.com / ceo123');
    console.log('   Tech Founder: juan@techstart.sv / tech123');

  } catch (error) {
    console.error('❌ Error en seeder:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado de MongoDB');
    process.exit(0);
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  runSeeder();
}

module.exports = {
  seedSuperAdmin,
  seedDemoData,
  seedMultiCompanyUser,
  runSeeder
};