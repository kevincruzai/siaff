#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Mapeo de archivos: nuevo -> existente
const fileReplacements = {
  // Modelos
  'src/models/User-new.js': 'src/models/User.js',
  'src/models/Company-new.js': 'src/models/Company.js',
  // UserCompany es nuevo, no reemplaza nada
  
  // Rutas
  'src/routes/auth-new.js': 'src/routes/auth.js',
  'src/routes/admin-new.js': 'src/routes/admin.js',
  
  // Middleware
  'src/middleware/auth-new.js': 'src/middleware/auth.js',
  
  // Server
  'src/server-new.js': 'src/server.js',
  
  // Seeds
  'src/seeds/index-new.js': 'src/seeds/index.js'
};

// Archivos nuevos que no reemplazan nada
const newFiles = [
  'src/models/UserCompany.js'
];

const backupDir = 'backup-' + new Date().toISOString().slice(0, 10);

console.log('🔄 Iniciando migración a sistema multitenant...\n');

// Crear directorio de backup
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
  console.log(`📁 Directorio de backup creado: ${backupDir}`);
}

// Función para crear backup
function createBackup(filePath) {
  if (fs.existsSync(filePath)) {
    const backupPath = path.join(backupDir, filePath);
    const backupDirPath = path.dirname(backupPath);
    
    if (!fs.existsSync(backupDirPath)) {
      fs.mkdirSync(backupDirPath, { recursive: true });
    }
    
    fs.copyFileSync(filePath, backupPath);
    console.log(`💾 Backup creado: ${filePath} -> ${backupPath}`);
    return true;
  }
  return false;
}

// Función para reemplazar archivo
function replaceFile(newFilePath, existingFilePath) {
  if (fs.existsSync(newFilePath)) {
    // Crear backup del archivo existente
    createBackup(existingFilePath);
    
    // Copiar nuevo archivo
    fs.copyFileSync(newFilePath, existingFilePath);
    console.log(`✅ Reemplazado: ${existingFilePath}`);
    
    // Eliminar archivo temporal
    fs.unlinkSync(newFilePath);
    console.log(`🗑️  Eliminado archivo temporal: ${newFilePath}`);
    
    return true;
  } else {
    console.log(`❌ No se encontró: ${newFilePath}`);
    return false;
  }
}

// Función para copiar archivo nuevo
function copyNewFile(filePath) {
  const newFilePath = filePath.replace('-new.js', '.js');
  
  if (fs.existsSync(filePath)) {
    fs.copyFileSync(filePath, newFilePath);
    console.log(`✅ Archivo nuevo copiado: ${newFilePath}`);
    
    // Eliminar archivo temporal
    fs.unlinkSync(filePath);
    console.log(`🗑️  Eliminado archivo temporal: ${filePath}`);
    
    return true;
  } else {
    console.log(`❌ No se encontró: ${filePath}`);
    return false;
  }
}

// Ejecutar reemplazos
console.log('📝 Reemplazando archivos existentes...\n');
let replacedCount = 0;
let totalReplacements = Object.keys(fileReplacements).length;

for (const [newFile, existingFile] of Object.entries(fileReplacements)) {
  if (replaceFile(newFile, existingFile)) {
    replacedCount++;
  }
  console.log('');
}

// Copiar archivos nuevos
console.log('📝 Copiando archivos nuevos...\n');
let newFileCount = 0;

for (const newFile of newFiles) {
  const newFilePath = newFile.replace('.js', '-new.js');
  if (copyNewFile(newFilePath)) {
    newFileCount++;
  }
  console.log('');
}

// Resumen
console.log('📊 Resumen de migración:');
console.log(`   ✅ Archivos reemplazados: ${replacedCount}/${totalReplacements}`);
console.log(`   ✅ Archivos nuevos: ${newFileCount}/${newFiles.length}`);
console.log(`   💾 Backup guardado en: ${backupDir}`);

if (replacedCount === totalReplacements && newFileCount === newFiles.length) {
  console.log('\n🎉 ¡Migración completada exitosamente!');
  console.log('\n📋 Siguientes pasos:');
  console.log('   1. Ejecutar: npm run seed:new (para poblar la base de datos)');
  console.log('   2. Ejecutar: npm run dev (para probar el nuevo sistema)');
  console.log('   3. Actualizar frontend con nuevos componentes');
  
  console.log('\n🔑 Credenciales de prueba después del seeding:');
  console.log('   Super Admin: admin@siaff.net / admin123');
  console.log('   Demo Owner: maria@empresa.com / demo123');
  console.log('   Multi-Company CEO: ceo@holding.com / ceo123');
} else {
  console.log('\n⚠️  Migración incompleta. Revisa los errores anteriores.');
}

console.log('\n🔄 Migración finalizada.\n');

// Verificar que todos los archivos críticos estén en su lugar
console.log('🔍 Verificando archivos críticos...');
const criticalFiles = [
  'src/models/User.js',
  'src/models/Company.js',
  'src/models/UserCompany.js',
  'src/routes/auth.js',
  'src/routes/admin.js',
  'src/middleware/auth.js',
  'src/server.js',
  'src/seeds/index.js'
];

let allCriticalFilesExist = true;
for (const file of criticalFiles) {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - FALTANTE`);
    allCriticalFilesExist = false;
  }
}

if (allCriticalFilesExist) {
  console.log('\n✅ Todos los archivos críticos están presentes.');
} else {
  console.log('\n❌ Faltan archivos críticos. Revisa la migración.');
}