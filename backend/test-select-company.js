const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const testSelectCompany = async () => {
  try {
    console.log('🧪 Probando flujo completo...');
    
    // Paso 1: Login
    console.log('1️⃣ Haciendo login...');
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
    
    console.log(`📊 Token: ${token.substring(0, 50)}...`);
    console.log(`🏢 Companies found: ${companies.length}`);
    
    if (companies.length === 0) {
      console.log('❌ No companies found');
      return;
    }

    // Paso 2: Seleccionar primera empresa
    const firstCompany = companies[0];
    console.log(`2️⃣ Seleccionando empresa: ${firstCompany.name} (${firstCompany.id})`);
    
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

    const selectResult = await selectResponse.text();
    
    console.log(`📊 Select Status: ${selectResponse.status}`);
    console.log(`📝 Select Response:`, selectResult);

    if (selectResponse.ok) {
      console.log('✅ Company selection successful');
      const parsed = JSON.parse(selectResult);
      console.log('🏢 Selected Company:', parsed.data?.selectedCompany?.name);
    } else {
      console.log('❌ Company selection failed');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

testSelectCompany();