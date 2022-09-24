import { Message } from "@prisma/client";
import { WebSocket } from "ws";
import { WebSocketServer } from "ws";
import { prisma } from "../db";

const map = new Map<string, WebSocket>();
const wss = new WebSocketServer({ clientTracking: false, noServer: true });
let newMessages: Omit<Message, "id">[] = [];

setInterval(async () => {
  if (newMessages.length !== 0) {
    await prisma.message.createMany({
      data: newMessages,
    });
    newMessages = [];
  }
}, 5000);

const sendUserlist = () => {
  const allUsers: string[] = [];
  for (const user of map.keys()) {
    allUsers.push(user);
  }

  map.forEach((client) =>
    client.send(JSON.stringify({ type: "users", content: allUsers }))
  );
};

wss.on("connection", function (ws, user: { id: number; name: string }) {
  map.set(user.name, ws);

  sendUserlist();

  ws.on("message", function (message) {
    const newMessage = {
      authorId: user.id,
      content: message.toString(),
      createdAt: new Date(),
    };

    map.forEach((client) =>
      client.send(
        JSON.stringify({
          type: "message",
          content: message.toString(),
          author: {
            name: user.name,
          },
          createdAt: newMessage.createdAt,
        })
      )
    );

    newMessages.push(newMessage);
  });

  ws.on("close", () => map.delete(user.name) && sendUserlist());
});

export default wss;
