class ValidationError extends Error {
  constructor(message = "Validation error.") {
    super(message);
  }
}

module.exports = ValidationError;
