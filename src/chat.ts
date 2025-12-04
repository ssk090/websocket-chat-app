import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  socket: WebSocket;
  room: string;
}

let allSockets: User[] = [];

wss.on("connection", (socket) => {
  console.log("user connected");
  socket.on("message", (message) => {
    const parsedMessage = JSON.parse(message.toString());

    if (parsedMessage.type === "join") {
      allSockets.push({
        socket,
        room: parsedMessage.payload.roomId,
      });
    }

    if (parsedMessage.type === "chat") {
      const user = allSockets.find((u) => u.socket === socket);
      if (user) {
        allSockets.forEach((u) => {
          if (u.room === user.room) {
            u.socket.send(parsedMessage.payload.message);
          }
        });
      }
    }
  });
});
