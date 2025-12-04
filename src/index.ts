import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

let userCount = 0;
let allSockets: WebSocket[] = [];

wss.on("connection", (socket) => {
  allSockets.push(socket);
  userCount++;
  console.log("user connected #", userCount);

  socket.on("message", (message) => {
    console.log("message received", message.toString());

    allSockets.forEach((s) => {
      s.send(message.toString());
    });
  });

  socket.on("disconnect", () => {
    allSockets = allSockets.filter((x) => x !== socket);
  });
});
