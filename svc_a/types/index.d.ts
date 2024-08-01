interface CustomResponse {
  statusCode: number | undefined,
  headers: import("http").IncomingHttpHeaders,
  body: string,
  error?: Error
}