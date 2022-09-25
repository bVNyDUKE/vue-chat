import * as dotenv from "dotenv";
dotenv.config();

import { WebSocket } from "ws";
import http from "http";
import app, { sessionParser } from "./src/http";
import wss from "./src/socket";
import { Request, Response } from "express";

const server = http.createServer(app);

server.on("upgrade", (request: Request, socket, head) => {
  sessionParser(request, {} as Response, () => {
    if (!request.session.user) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }

    wss.handleUpgrade(request, socket, head, function(ws: WebSocket) {
      wss.emit("connection", ws, request.session.user);
    });
  });
});

const port = 8000;
server.listen(port, () => {
  console.log(`App started on port ${port}`);
});
