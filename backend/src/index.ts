import Server from "./server.js";

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