class DisabledClientError extends Error {
    constructor(message = "Unsupported disabled clients.") {
      super(message);
    }
  }
  
module.exports = DisabledClientError;
  