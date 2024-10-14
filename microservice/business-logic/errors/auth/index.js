const InvalidRequestError = require("./invalid-request-error");
const UnsupportedGrantTypeError = require("./unsupported-grant-type-error");
const InvalidClientError = require("./invalid-client-error");
const InvalidOrExpiredTokenError = require("./invalid-or-expired-token-error");

module.exports = {
  InvalidRequestError,
  UnsupportedGrantTypeError,
  InvalidClientError,
  InvalidOrExpiredTokenError,
};
