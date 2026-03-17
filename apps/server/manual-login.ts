// apps/server/manual-login.ts
import axios from 'axios';

async function main() {
  try {
    const res = await axios.post('http://localhost:4000/api/auth/login', {
      email: 'admin@formaleasy.cd',
      password: 'admin123'
    });
    console.log('Login Success:', res.data.user.role);
    console.log('Token Length:', res.data.accessToken.length);
  } catch (err: any) {
    console.error('Login Failed:', err.response?.status, err.response?.data);
  }
}

main();
