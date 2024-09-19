class InvalidOrExpiredTokenError extends Error {
  constructor(message = "Invalid or expired token.") {
    super(message);
  }
}

module.exports = InvalidOrExpiredTokenError;
