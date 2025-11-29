// Script untuk generate password hash baru
// Jalankan dengan: node scripts/generate-password.js

const bcrypt = require('bcryptjs');

// Ganti password di sini
const newPassword = 'trimly2025';

// Generate hash
const hash = bcrypt.hashSync(newPassword, 10);

console.log('\n=================================');
console.log('Password Hash Generator');
console.log('=================================\n');
console.log(`Password: ${newPassword}`);
console.log(`Hash: ${hash}\n`);
console.log('Copy hash di atas dan paste ke:');
console.log('app/api/auth/login/route.ts');
console.log('=================================\n');

// Verify hash works
const isValid = bcrypt.compareSync(newPassword, hash);
console.log(`Verification: ${isValid ? '✅ Valid' : '❌ Invalid'}\n`);
