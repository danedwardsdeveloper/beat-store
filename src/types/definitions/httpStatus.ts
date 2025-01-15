export enum HttpStatus {
  http200ok = 200,
  http201created = 201,
  http202accepted = 202,
  http204noContent = 204,
  http206partialContent = 206,

  http400badRequest = 400,
  http401unauthorised = 401,
  http403forbidden = 403,
  http404notFound = 404,
  http405methodNotAllowed = 405,
  http409conflict = 409,
  http410gone = 410,
  http415unsupportedMediaType = 415,
  http429tooManyRequests = 429,

  http500serverError = 500,
  http501notImplemented = 501,
  http502badGateway = 502,
  http503serviceUnavailable = 503,
  http504gatewayTimeout = 504,
}
