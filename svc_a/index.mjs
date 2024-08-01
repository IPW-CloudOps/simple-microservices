import * as http from "node:http";
import { sendRequest } from "./request.mjs";

const PORT = 9700;

const BASE_NAME = "a";

const SUFFIX = process.env.POD_NAME || Math.random().toString(36).slice(2);

const NAME = BASE_NAME + "-" + SUFFIX;

const server = http.createServer(async (req, res) => {
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

    let resp;
    if (req.url.includes("action=doRequest")) {
      resp = await sendRequest(
        `http://b.my_microservice.io`,
        {
          method: "GET",
          headers: Object.assign({}, req.headers, {
            caller: "a.my_microservice.io",
            host: "b.my_microservice.io",
          })
        }
      );
    } else {
      resp = {}
    }


    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    res.end(JSON.stringify(Object.assign(responseObj, { proxied: resp })));
  } catch (error) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Invalid JSON' }));
  }
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});