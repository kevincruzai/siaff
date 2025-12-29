const jwt = require('jsonwebtoken');

// Simular login como admin para obtener token
async function testAdminLogin() {
  try {
    console.log('🔐 Testing admin login...');
    
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@siaff.net',
        password: 'admin123' // Esto es un guess basado en datos típicos
      })
    });

    if (!loginResponse.ok) {
      const errorData = await loginResponse.json();
      console.log('❌ Login failed:', errorData);
      
      // Intentar con otra contraseña común
      console.log('🔄 Trying alternative password...');
      const alternateResponse = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'admin@siaff.net',
          password: 'password'
        })
      });

      if (!alternateResponse.ok) {
        const altErrorData = await alternateResponse.json();
        console.log('❌ Alternative login failed:', altErrorData);
        return null;
      }

      const altLoginData = await alternateResponse.json();
      console.log('✅ Login successful with alternative password');
      console.log('👤 User:', altLoginData.data?.user?.name);
      console.log('🔑 Global Role:', altLoginData.data?.user?.globalRole);
      return altLoginData.data?.token;
    }

    const loginData = await loginResponse.json();
    console.log('✅ Login successful');
    console.log('👤 User:', loginData.data?.user?.name);
    console.log('🔑 Global Role:', loginData.data?.user?.globalRole);
    console.log('🔑 Token preview:', loginData.data?.token?.substring(0, 50) + '...');
    
    return loginData.data?.token;
    
  } catch (error) {
    console.error('❌ Login error:', error.message);
    return null;
  }
}

// Test admin API con token válido
async function testAdminAPI(token) {
  try {
    console.log('\n📊 Testing admin API...');
    
    const response = await fetch('http://localhost:5000/api/admin/users', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ API call failed:', errorText);
      return;
    }

    const data = await response.json();
    console.log('✅ API call successful');
    console.log('📊 Data structure:', {
      status: data.status,
      userCount: data.data?.users?.length || 0,
      hasUsers: !!data.data?.users,
      firstUser: data.data?.users?.[0] ? {
        id: data.data.users[0].id,
        name: data.data.users[0].user?.name,
        email: data.data.users[0].user?.email,
        company: data.data.users[0].company?.name,
        role: data.data.users[0].role,
        status: data.data.users[0].status
      } : 'No users'
    });

  } catch (error) {
    console.error('❌ API test error:', error.message);
  }
}

async function main() {
  const token = await testAdminLogin();
  if (token) {
    await testAdminAPI(token);
  } else {
    console.log('❌ Could not obtain admin token');
  }
}

main();