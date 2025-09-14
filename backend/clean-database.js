const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const cleanDatabase = async () => {
  try {
    console.log('🧹 Conectando a MongoDB para limpiar la base de datos...');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);

    // Obtener la referencia a la base de datos
    const db = conn.connection.db;

    console.log('🗑️  Eliminando todas las colecciones...');
    
    // Obtener lista de colecciones
    const collections = await db.listCollections().toArray();
    
    for (const collection of collections) {
      console.log(`   Eliminando colección: ${collection.name}`);
      await db.collection(collection.name).drop();
    }

    console.log('✅ Base de datos limpiada exitosamente');
    
  } catch (error) {
    console.error('❌ Error limpiando base de datos:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
    process.exit(0);
  }
};

// Ejecutar limpieza
cleanDatabase();