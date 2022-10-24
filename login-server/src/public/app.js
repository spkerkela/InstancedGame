const app = document.getElementById("app");

const render = (data) => {
  const html = Object.keys(data).map((key) => {
    const isOnline = data[key] !== null;
    const { connections, url } = data[key] || { connections: 0 };
    const link = isOnline ? `<a href="${url}">${url}</a>` : "";
    return `
      <div>
        <h3>${key}</h3>
        <div class=${isOnline ? "green" : "red"}>${
      data[key] ? "Online" : "Offline"
    }</div>
        <div>Connections: ${connections}</div>
        ${link}
      </div>
    `;
  });
  app.innerHTML = html.join("");
};

function getServersStatus() {
  fetch("/status")
    .then((response) => response.json())
    .then((data) => render(data));
}

setInterval(getServersStatus, 1000);
