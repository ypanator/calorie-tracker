import Server from "./server.js";

const server = new Server();
await server.init();
server.start();