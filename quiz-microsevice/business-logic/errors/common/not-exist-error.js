class NotExistError extends Error {
  constructor(message = "Not found error.") {
    super(message);
  }
}

module.exports = NotExistError;
