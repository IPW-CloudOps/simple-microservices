import http from "node:http";

/**
 * 
 * @param {string} url 
 * @param {http.RequestOptions} opts 
 * @param {string} body 
 * @returns {Promise<CustomResponse>}
 */
export function sendRequest(url, opts, body){
  return new Promise((resolve, reject) => {
    console.info(opts);
    const req = http.request(url, opts, (res) => {
      let data = "";
      res.setEncoding('utf8');

      res.on('data', (chunk) => {
        data += chunk
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    
    req.on('error', (e) => {
      let rawPacket = "";
      try {
        rawPacket = e.rawPacket.toString()
      } catch(err) {}
      reject({
        statusCode: typeof res !== "undefined" ? res.statusCode : 500,
        headers: typeof res !== "undefined" ? res.headers : {},
        body: "ERROR: " + e.message + rawPacket ? ("\n\n" + rawPacket) : "",
        error: e
      })
    });
  })
}