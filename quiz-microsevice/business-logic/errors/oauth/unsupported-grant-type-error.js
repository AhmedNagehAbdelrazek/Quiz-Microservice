class UnsupportedGrantTypeError extends Error {
  constructor(message = "Unsupported grant type.") {
    super(message);
  }
}

module.exports = UnsupportedGrantTypeError;
