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
      // support both `room` and `roomId` fields
      const room = parsedMessage.payload?.room ?? parsedMessage.payload?.roomId;
      allSockets.push({
        socket,
        room,
      });
      return;
    }

    if (parsedMessage.type === "chat") {
      const user = allSockets.find((u) => u.socket === socket);
      if (user) {
        // broadcast only to OTHER sockets in the same room (do not echo back to sender)
        allSockets.forEach((u) => {
          if (
            u.socket !== socket &&
            u.room === user.room &&
            u.socket.readyState === WebSocket.OPEN
          ) {
            u.socket.send(parsedMessage.payload.message);
          }
        });
      }
    }
  });

  socket.on("close", () => {
    allSockets = allSockets.filter((x) => x.socket !== socket);
    console.log("user disconnected");
  });
});
