class InvalidClientError extends Error {
  constructor(message = "Invalid client error") {
    super(message);
  }
}

module.exports = InvalidClientError;
