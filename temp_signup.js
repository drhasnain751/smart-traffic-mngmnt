const fetch = require('node-fetch');
(async () => {
  try {
    const signupRes = await fetch('http://localhost:5002/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test User', email: 'test@example.com', password: 'Password123!', role: 'OPERATOR' })
    });
    const signupData = await signupRes.json();
    console.log('Signup response:', signupRes.status, signupData);
    const loginRes = await fetch('http://localhost:5002/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'Password123!' })
    });
    const loginData = await loginRes.json();
    console.log('Login response:', loginRes.status, loginData);
  } catch (e) {
    console.error('Error:', e);
  }
})();
