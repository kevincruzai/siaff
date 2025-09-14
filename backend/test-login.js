const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const testLogin = async () => {
  try {
    console.log('🧪 Probando login directo al backend...');
    
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'ceo@holding.com',
        password: 'ceo123'
      }),
    });

    const result = await response.text();
    
    console.log(`📊 Status: ${response.status}`);
    console.log(`📝 Response:`, result);

    if (!response.ok) {
      console.log('❌ Login failed');
    } else {
      console.log('✅ Login successful');
      const parsed = JSON.parse(result);
      console.log('👤 User:', parsed.data?.user?.name);
      console.log('🏢 Companies:', parsed.data?.user?.companies?.length);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

testLogin();