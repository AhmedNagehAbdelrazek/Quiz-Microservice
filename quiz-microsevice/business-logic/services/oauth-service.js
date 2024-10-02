const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const {
  InvalidRequestError,
  UnsupportedGrantTypeError,
  InvalidClientError,
} = require("../errors/oauth");

const { clientRepository } = require("../../data-access/repositories");

const { JWT_SECRET, ACCESS_TOKEN_EXPIRY } = process.env;

const generateToken = async (grantType, clientId, clientSecret) => {
  if (typeof grantType !== "string") {
    throw new InvalidRequestError("Invalid grant_type, it must be a string.");
  }

  if (typeof clientId !== "string") {
    throw new InvalidRequestError("Invalid client_id, it must be a string.");
  }

  if (typeof clientSecret !== "string") {
    throw new InvalidRequestError(
      "Invalid client_secret, it must be a string."
    );
  }

  if (grantType !== "client_credentials") {
    throw new UnsupportedGrantTypeError("Unsupported 'grant_type'.");
  }

  const client = await clientRepository.retrieveClientByClientId(clientId);

  if (
    !client ||
    !client.enabled ||
    !bcrypt.compareSync(clientSecret, client.clientSecretHash)
  ) {
    throw new InvalidClientError("Incorrect 'client_id' or 'client_secret'.");
  }

  return jwt.sign({ clientId }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

module.exports = { generateToken };
