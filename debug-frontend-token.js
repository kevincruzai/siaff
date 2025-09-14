// Debug script para verificar el estado del token en el frontend
// Ejecuta esto en la consola del navegador

console.log('=== DEBUG TOKEN FRONTEND ===');

// Verificar localStorage
console.log('1. Contenido del localStorage:');
console.log('siaff_token:', localStorage.getItem('siaff_token'));
console.log('siaff_user:', localStorage.getItem('siaff_user'));
console.log('siaff_company:', localStorage.getItem('siaff_company'));

// Verificar si el token es válido
const token = localStorage.getItem('siaff_token');
if (token) {
    console.log('2. Token encontrado, longitud:', token.length);
    
    // Intentar parsear el JWT para ver su contenido
    try {
        const parts = token.split('.');
        if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            console.log('3. Payload del JWT:', payload);
            
            // Verificar si el token ha expirado
            if (payload.exp) {
                const expDate = new Date(payload.exp * 1000);
                const now = new Date();
                console.log('4. Token expira en:', expDate);
                console.log('   Fecha actual:', now);
                console.log('   ¿Token expirado?', now > expDate);
            }
        } else {
            console.log('3. Token no tiene formato JWT válido');
        }
    } catch (e) {
        console.log('3. Error parseando JWT:', e.message);
    }
} else {
    console.log('2. No hay token en localStorage');
}

// Función para probar la llamada select-company
async function testSelectCompany(companyId) {
    const token = localStorage.getItem('siaff_token');
    console.log('5. Probando select-company con token:', token ? token.substring(0, 20) + '...' : 'null');
    
    try {
        const response = await fetch('/api/auth/select-company', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ companyId }),
        });
        
        console.log('6. Status de response:', response.status);
        const result = await response.json();
        console.log('7. Resultado:', result);
        
        return result;
    } catch (error) {
        console.log('6. Error en request:', error);
    }
}

// Exponer función para testing
window.testSelectCompany = testSelectCompany;

console.log('=== FIN DEBUG ===');
console.log('Para probar select-company, ejecuta: testSelectCompany("66e4c8a0d4f2e3e8e8a4b2d1")');