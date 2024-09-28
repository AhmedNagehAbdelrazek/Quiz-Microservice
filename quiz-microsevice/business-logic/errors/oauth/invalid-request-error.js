class InvalidRequestError extends Error {
  constructor(message = "Invalid Request.") {
    super(message);
  }
}

module.exports = InvalidRequestError;
