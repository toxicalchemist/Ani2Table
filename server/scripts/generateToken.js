import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const [,, id, username, userType] = process.argv;

if (!id || !username || !userType) {
  console.error('Usage: node scripts/generateToken.js <id> <username> <userType>');
  process.exit(1);
}

const payload = { id: Number(id), username, userType };
const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });
console.log(token);
