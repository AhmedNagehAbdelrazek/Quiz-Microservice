const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { ValidationError } = require("../errors/common");

const {
  UnsupportedGrantTypeError,
  InvalidClientError,
  DisabledClientError,
} = require("../errors/oauth");

const { clientRepository } = require("../../data-access/repositories");

const { JWT_SECRET, ACCESS_TOKEN_EXPIRY } = process.env;

const generateToken = async (grantType, clientId, clientSecret) => {
  if (!grantType || typeof grantType !== "string") {
    throw new ValidationError(
      "Invalid or missing grant_type. It must be a non-empty string."
    );
  }

  if (!clientId || typeof clientId !== "string") {
    throw new ValidationError(
      "Invalid or missing client_id. It must be a non-empty string."
    );
  }

  if (!clientSecret || typeof clientSecret !== "string") {
    throw new InvalidClientError(
      "Invalid or missing client_secret. It must be a non-empty string."
    );
  }

  if (grantType !== "client_credentials") {
    throw new UnsupportedGrantTypeError(
      `The provided grant type "${grantType}" is not supported.`
    );
  }

  const client = await clientRepository.retrieveOneByClientId(clientId);

  if(client && client.isEnabled === false){
    throw new DisabledClientError(
      "Client is disabled. Cannot be authenticated."
    );
  };

  if (!client || !bcrypt.compareSync(clientSecret, client.clientSecretHash)) {
    throw new InvalidClientError(
      "The provided 'client_id' or 'client_secret' is incorrect."
    );
  }

  return jwt.sign({ clientId }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY || '1h'
  });
};

module.exports = { generateToken };
