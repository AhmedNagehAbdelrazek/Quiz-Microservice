const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { ClientStatus } = require("../enums");
const {
  InvalidRequestError,
  UnsupportedGrantTypeError,
  InvalidClientError,
} = require("../errors/oauth");

const { clientRepository } = require("../../data-access/repositories");

const { JWT_SECRET, ACCESS_TOKEN_EXPIRY } = process.env;

const generateAccessToken = async (grant_type, client_id, client_secret) => {
  if (typeof grant_type !== "string") {
    throw new InvalidRequestError("Invalid grant_type, it must be a string.");
  }

  if (typeof client_id !== "string") {
    throw new InvalidRequestError("Invalid client_id, it must be a string.");
  }

  if (typeof client_secret !== "string") {
    throw new InvalidRequestError(
      "Invalid client_secret, it must be a string."
    );
  }

  if (grant_type !== "client_credentials") {
    throw new UnsupportedGrantTypeError("Unsupported 'grant_type'.");
  }

  const client = await clientRepository.retrieveClientForOAuth(client_id);

  if (
    !client ||
    client.status === ClientStatus.INACTIVE ||
    !bcrypt.compareSync(client_secret, client.client_secret_hash)
  ) {
    throw new InvalidClientError("Incorrect 'client_id' or 'client_secret'.");
  }

  return jwt.sign({ client_id }, JWT_SECRET, {
    expiresIn: "1h",
  });
};

module.exports = { generateAccessToken };
