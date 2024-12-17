export type BasicResponses =
  | 'success' //
  | 'server error'
  | 'database error'

export type AuthResponses =
  | 'token missing'
  | 'invalid token'
  | 'expired token'
  | 'user not found'
  | 'unauthorised'
  | 'authorisation error'
