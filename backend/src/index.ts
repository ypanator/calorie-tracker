import Server from "./server.js";
import dotenv from "dotenv";
import path from 'path';

// Load env file from current directory
const envPath = path.resolve('./keys.env');
console.log('Loading environment variables from:', envPath);
const result = dotenv.config({ path: envPath });
if (result.error) {
    console.error('Error loading .env file:', result.error);
} else {
    console.log('Dotenv parsed the following keys:', Object.keys(result.parsed || {}));
}

// Debug: Check if JWT_SECRET is loaded
console.log('ENV Path:', envPath);
console.log('JWT_SECRET is ' + (process.env.JWT_SECRET ? 'set' : 'not set'));
console.log('Environment variables loaded:', Object.keys(process.env));

const server = new Server();
await server.init();
server.start();

process.on('SIGINT', async () => {
    try {
        await server.close();
        console.log('Sequelize connection closed gracefully.');
        process.exit(0);
    } catch (err) {
        console.error('Error during Sequelize shutdown:', err);
        process.exit(1);
    }
});

process.on('SIGTERM', async () => {
    try {
        await server.close();
        console.log('Sequelize connection closed on SIGTERM.');
        process.exit(0);
    } catch (err) {
        console.error('Sequelize close error:', err);
        process.exit(1);
    }
});