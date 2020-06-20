const express = require("express");

const http = require("http");
const dbClient = require("./services/db-service");
const env = require("../src/config");
console.log("env: ", process.env.NODE_ENV);

const { ChatRoom } = require("./sockets/chat-room");
const app = express();
const server = http.createServer(app);

// TODO: 1 add env files for prod and dev

(startServer = async () => {
  env.init();
  await dbClient.init({
    host: env.dbHost,
    port: env.dbPort,
    user: env.dbName,
    password: env.dbPass,
    database: env.dbName
  });
  ChatRoom(server); // assign room socket to server
  const port = process.env.PORT || 3000;

  app.set("port", port);

  app.get("/healtz", (req, res) => {
    res.send("ok");
  });

  server.listen(port, () => {
    console.log("Server is listening on " + port);
  });
})();
