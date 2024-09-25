const {
  InvalidRequestError,
  UnsupportedGrantTypeError,
  InvalidClientError,
} = require("../../business-logic/errors/oauth");

const oauthErrorHandler = (err, req, res, next) => {
  if (err instanceof InvalidRequestError) {
    return res.status(400).json({
      error: "invalid_request",
      error_description: err.message,
    });
  }

  if (err instanceof UnsupportedGrantTypeError) {
    return res.status(400).json({
      error: "unsupported_grant_type",
      error_description: err.message,
    });
  }

  if (err instanceof InvalidClientError) {
    return res.status(401).json({
      error: "invalid_client",
      error_description: err.message,
    });
  }

  console.log(err);

  return res.status(500).json({
    error: "server_error",
    error_description: "An unexpected error occurred on the server.",
  });
};

module.exports = oauthErrorHandler;