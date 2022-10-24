const webSocket = new WebSocket("ws://" + window.location.host);

function addMessage(message) {
  const messages = document.getElementById("messages");
  const li = document.createElement("li");
  li.innerHTML = message;
  messages.appendChild(li);
}

let id = null;
let ticks = 0;

webSocket.onopen = () => {
  console.log("WebSocket Client Connected");
};

webSocket.onmessage = (message) => {
  try {
    const data = JSON.parse(message.data);
    if (id === null && data.id) {
      id = data.id;
    }
    if (data.from !== id) {
      if (data.message) {
        addMessage(data.message);
      }
    }
  } catch (error) {}
};

webSocket.onclose = () => {
  console.log("WebSocket Client Closed");
};

webSocket.onerror = (error) => {
  console.error(error);
};

setInterval(() => {
  if (id !== null) {
    webSocket.send(JSON.stringify({ id, ticks, message: "Hello" }));
    ticks++;
  }
}, 16);

function sendMessage() {
  const input = document.getElementById("message");
  webSocket.send(JSON.stringify({ id, broadcast: true, message: input.value }));
  addMessage(">> " + input.value);
}
