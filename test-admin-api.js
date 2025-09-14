// Script de prueba para los endpoints de administración

const BASE_URL = 'http://localhost:5000';

// Función para hacer login como super admin
async function loginSuperAdmin() {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@siaff.net',
        password: 'admin123'
      })
    });

    const data = await response.json();
    if (data.status === 'success') {
      console.log('✅ Login exitoso como super admin');
      return data.data.token;
    } else {
      console.log('❌ Error en login:', data.message);
      return null;
    }
  } catch (error) {
    console.log('❌ Error de conexión en login:', error.message);
    return null;
  }
}

// Función para obtener estadísticas
async function getStats(token) {
  try {
    const response = await fetch(`${BASE_URL}/api/admin/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    if (data.status === 'success') {
      console.log('✅ Estadísticas obtenidas:');
      console.log('   - Usuarios pendientes:', data.data.userStats.pending);
      console.log('   - Usuarios activos:', data.data.userStats.active);
      console.log('   - Usuarios suspendidos:', data.data.userStats.suspended);
      console.log('   - Usuarios rechazados:', data.data.userStats.rejected);
      console.log('   - Total usuarios:', data.data.userStats.total);
      
      if (data.data.companyStats) {
        console.log('   - Empresas Free:', data.data.companyStats.Free);
        console.log('   - Empresas Startup:', data.data.companyStats.Startup);
        console.log('   - Empresas Professional:', data.data.companyStats.Professional);
        console.log('   - Empresas Enterprise:', data.data.companyStats.Enterprise);
        console.log('   - Total empresas:', data.data.companyStats.total);
      }
      
      return data.data;
    } else {
      console.log('❌ Error obteniendo estadísticas:', data.message);
      return null;
    }
  } catch (error) {
    console.log('❌ Error de conexión obteniendo estadísticas:', error.message);
    return null;
  }
}

// Función para obtener usuarios
async function getUsers(token) {
  try {
    const response = await fetch(`${BASE_URL}/api/admin/users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    if (data.status === 'success') {
      console.log('✅ Usuarios obtenidos:');
      console.log(`   - Total de usuarios: ${data.data.users.length}`);
      
      data.data.users.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.name} (${user.email})`);
        console.log(`      - Empresa: ${user.company?.name || 'Sin empresa'}`);
        console.log(`      - Rol: ${user.role}`);
        console.log(`      - Estado: ${user.status}`);
        console.log(`      - Fecha: ${new Date(user.createdAt).toLocaleDateString()}`);
        console.log('');
      });
      
      return data.data.users;
    } else {
      console.log('❌ Error obteniendo usuarios:', data.message);
      return null;
    }
  } catch (error) {
    console.log('❌ Error de conexión obteniendo usuarios:', error.message);
    return null;
  }
}

// Función principal
async function testAdminAPI() {
  console.log('🚀 Iniciando pruebas de API de administración...\n');
  
  // 1. Login
  const token = await loginSuperAdmin();
  if (!token) {
    console.log('❌ No se pudo obtener token, terminando pruebas');
    return;
  }
  
  console.log('');
  
  // 2. Obtener estadísticas
  await getStats(token);
  
  console.log('');
  
  // 3. Obtener usuarios
  await getUsers(token);
  
  console.log('✅ Pruebas completadas exitosamente!');
}

// Ejecutar pruebas
testAdminAPI();