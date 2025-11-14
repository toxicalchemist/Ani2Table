// Script to generate hashed passwords for demo accounts
// Run this with: node server/scripts/hashPassword.js

import bcrypt from 'bcryptjs';

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const generateDemoPasswords = async () => {
  console.log('Generating hashed passwords for demo accounts...\n');
  
  const password = 'password'; // Default password for all demo accounts
  const hashed = await hashPassword(password);
  
  console.log('Password: password');
  console.log('Hashed:', hashed);
  console.log('\nSQL Update Statements:');
  console.log('-----------------------------------');
  console.log('USE ani2table;');
  console.log(`UPDATE users SET password = '${hashed}' WHERE username = 'consumer';`);
  console.log(`UPDATE users SET password = '${hashed}' WHERE username = 'farmer';`);
  console.log(`UPDATE users SET password = '${hashed}' WHERE username = 'admin';`);
  console.log('-----------------------------------\n');
  console.log('Copy and run these SQL statements in your MySQL database.');
};

generateDemoPasswords().catch(console.error);
