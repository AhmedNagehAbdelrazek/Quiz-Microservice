class InvalidClientError extends Error {
  constructor(message = "Invalid client.") {
    super(message);
  }
}

module.exports = InvalidClientError;
