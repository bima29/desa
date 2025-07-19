import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Karena pakai ES Module, `__dirname` tidak langsung tersedia:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file secara eksplisit
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Debug output (boleh hapus setelah berhasil)
console.log('ENV JWT_SECRET:', process.env.JWT_SECRET);
