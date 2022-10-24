const express = require("express");
const http = require("http");
const { WebSocket } = require("ws");
const path = require("path");
const uuid = require("uuid");

const hostname = process.env.HOSTNAME || "localhost";
const port = process.env.PORT || 50000;
const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.get("/status", (req, res) => {
  res.json({
    status: "OK",
    connections: wss.clients.size,
    url: `http://${hostname}:${port}`,
  });
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  if (wss.clients.size > 9) {
    ws.terminate();
  }
  const id = uuid.v4();

  ws.id = id;
  ws.send(JSON.stringify({ id: id }));
  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      if (data.id != null && data.id === id) {
        ws.timeSinceLastMessage = process.hrtime();
      }
      if (data.broadcast) {
        console.log(data);
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ from: ws.id, ...data }));
          }
        });
      }
    } catch (error) {}
  });
  ws.on("close", () => {
    console.log(`Client ${id} disconnected`);
  });
});

setInterval(() => {
  wss.clients.forEach((ws) => {
    const [timeInSeconds] = process.hrtime(ws.timeSinceLastMessage);
    if (timeInSeconds > 5) {
      return ws.terminate();
    }
  });
}, 10000);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
