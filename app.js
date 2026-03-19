import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import the server first (before changing directory)
await import('./back-end/server/server.js');