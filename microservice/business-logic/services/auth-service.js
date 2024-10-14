const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { ClientStatus } = require("../enums");

const {
  InvalidRequestError,
  UnsupportedGrantTypeError,
  InvalidClientError,
  InvalidOrExpiredTokenError,
} = require("../errors/auth");

const { clientRepository } = require("../../data-access/repositories");

const JWT_SECRET = process.env.JWT_SECRET;

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

  const client = await clientRepository.retrieveClientForAuth(client_id);

  if (
    !client ||
    client.status === ClientStatus.INACTIVE ||
    !bcrypt.compareSync(client_secret, client.client_secret_hash)
  ) {
    throw new InvalidClientError("Invalid 'client_id' or 'client_secret'.");
  }

  return jwt.sign({ client_id }, JWT_SECRET, {
    expiresIn: "1h",
  });
};

const authenticateClientByAccessToken = async (token) => {
  try {
    const { client_id } = jwt.decode(token, JWT_SECRET);

    const client = await clientRepository.retrieveClientForAuth(client_id);

    if (!client || client.status === ClientStatus.INACTIVE) {
      throw new Error();
    }

    delete client.client_secret_hash;

    return client;
  } catch (error) {
    throw new InvalidOrExpiredTokenError("Invalid or expired token.");
  }
};

module.exports = { generateAccessToken, authenticateClientByAccessToken };
