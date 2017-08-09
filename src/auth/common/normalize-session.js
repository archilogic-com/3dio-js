export default function normalizeSession(session_) {

  var isAuthenticated = !!session_.user
  var user = {}

  // populate user object if authenticated
  if (isAuthenticated) {
    user.id = session_.user.resourceId
    user.username = session_.user.resourceName
    user.email = session_.user.email
  }

  return {
    isAuthenticated: isAuthenticated,
    user: user
  }

}