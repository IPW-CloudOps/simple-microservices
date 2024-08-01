import * as http from "node:http";

const PORT = 9800;

const BASE_NAME = "b";

const SUFFIX = process.env.POD_NAME || Math.random().toString(36).slice(2);

const NAME = BASE_NAME + "-" + SUFFIX;

const server = http.createServer((req, res) => {
  console.info(NAME + ": Received request from:", req.headers["x-forwarded-for"]);

  try {
    const url = req.url;
    const ip = req.headers['x-forwarded-for'] || null;// || req.connection.remoteAddress;
    const name = NAME;

    const responseObj = {
      url,
      ip,
      name
    };

    console.log(responseObj);

    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    res.end(JSON.stringify(responseObj));
  } catch (error) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Invalid JSON' }));
  }
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});