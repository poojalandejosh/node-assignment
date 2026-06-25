import http from "http";

const args = process.argv.slice(2);
let env = "development";
let port = 3000;

for (const arg of args) {
  if (arg.startsWith("--port=")) {
    const parsedPort = Number(arg.split("=")[1]);

    if (Number.isNaN(parsedPort) || parsedPort <= 0 || parsedPort > 65535) {
      console.error("Invalid port. Use a number between 1 and 65535.");
      process.exit(1);
    }

    port = parsedPort;
  }

  if (arg.startsWith("--env=")) {
    env = arg.split("=")[1];
  }
}

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello World fnfnnffnn bdgdhhd");
});

server.listen(port, () => {
  console.log(`Server is running on port ${port} in ${env} mode`);
});
