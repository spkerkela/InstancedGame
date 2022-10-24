const express = require("express");
const path = require("path");
const { db } = require("./db");

const app = express();
const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));

const hostname = process.env.HOSTNAME || "localhost";
const port = process.env.PORT || 3000;

async function checkServerStatus(server) {
  try {
    const response = await fetch(
      `http://${server.hostname}:${server.port}/status`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}

let statusState = {};

setInterval(async () => {
  db.servers.forEach(async (server) => {
    const data = await checkServerStatus(server);
    statusState[server.name] = data;
  });
  console.log(statusState);
}, 1000);

app.get("/status", (req, res) => {
  res.json(statusState);
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  console.log(`Servers: ${JSON.stringify(db.servers)}`);
});
