const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const debugTokenFlow = async () => {
  try {
    console.log('🔍 Debugging token flow...');
    
    // Paso 1: Login
    console.log('\n1️⃣ Login...');
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'ceo@holding.com',
        password: 'ceo123'
      }),
    });

    const loginResult = await loginResponse.json();
    
    if (!loginResponse.ok) {
      console.log('❌ Login failed:', loginResult);
      return;
    }

    console.log('✅ Login successful');
    const token = loginResult.data.token;
    const companies = loginResult.data.user.companies;
    
    console.log(`🎫 Token length: ${token.length}`);
    console.log(`🎫 Token start: ${token.substring(0, 20)}...`);
    console.log(`🏢 Companies: ${companies.length}`);
    
    // Verificar el token con jwt
    const jwt = require('jsonwebtoken');
    const decoded = jwt.decode(token);
    console.log('\n🔓 Decoded token:', JSON.stringify(decoded, null, 2));
    
    // Paso 2: Intentar seleccionar empresa
    const firstCompany = companies[0];
    console.log(`\n2️⃣ Selecting company: ${firstCompany.name}`);
    console.log(`🆔 Company ID: ${firstCompany.id}`);
    
    const selectResponse = await fetch('http://localhost:5000/api/auth/select-company', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        companyId: firstCompany.id 
      }),
    });

    const selectText = await selectResponse.text();
    
    console.log(`\n📊 Select Status: ${selectResponse.status}`);
    console.log(`📝 Select Headers:`, Object.fromEntries(selectResponse.headers));
    console.log(`📝 Select Response:`, selectText);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

debugTokenFlow();