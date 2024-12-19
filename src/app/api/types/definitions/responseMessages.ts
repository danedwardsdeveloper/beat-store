export type BasicMessages =
  | 'success' //
  | 'server error'
  | 'database error'

export type AuthMessages =
  | 'token missing'
  | 'invalid token'
  | 'expired token'
  | 'user not found'
  | 'email not confirmed'
  | 'unauthorised'
  | 'authorisation error'
