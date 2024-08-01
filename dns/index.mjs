import express from "express";
import got from "got";
import http from "node:http";
import { sendRequest } from "./request.mjs";

const app = express();

const baseUrl = "http://localhost";

app.use(async (req, res, _) => {
  console.info("Received request from:", req.ip);

  let defaults = {
    svcName: "UNKNOWN",
    port: -1
  };
  if (req.headers.host) {
    switch (req.headers.host) {
      case "a.my_microservice.io":
        defaults.port = 9700;
        defaults.svcName = "a";
        break;
      case "b.my_microservice.io":
        defaults.port = 9800;
        defaults.svcName = "b";
        break;
    }
  }

  console.info(`Request for service '${defaults.svcName}'`);

  if (![9700, 9800].includes(defaults.port)) {
    res.sendStatus(500).send("Unknown host");
    return;
  }

  const resp = await sendRequest(
    `${baseUrl}:${defaults.port}${req.url}`,
    {
      method: req.method,
      headers: Object.assign({}, req.headers, {
        // https://developers.cloudflare.com/support/troubleshooting/restoring-visitor-ips/restoring-original-visitor-ips/
        "X-Forwarded-For": req.ip
      }),
    },
    req.body
  );

  // Can't have both transfer-encoding and Content-Length
  // https://github.com/nodejs/http-parser/issues/517
  // we can't kind get rid of Content-Length, so we delete transfer-encoding
  delete resp.headers["transfer-encoding"];
  for (let [header, val] of Object.entries(resp.headers)) {
    res.setHeader(header, val);
  }
  res.send(resp.body);
  return;
})

app.listen(80, "0.0.0.0", () => {
  console.info("Listening on port 80");
})