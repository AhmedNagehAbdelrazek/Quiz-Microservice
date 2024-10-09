const jwt = require("jsonwebtoken");

const { ClientStatus } = require("../enums");
const { InvalidOrExpiredTokenError } = require("../errors/auth");

const { clientRepository } = require("../../data-access/repositories");

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateClientByAccessToken = async (token) => {
  try {
    const { client_id } = jwt.decode(token, JWT_SECRET);

    const client = await clientRepository.retrieveClientForOAuth(client_id);

    if (!client || client.status === ClientStatus.INACTIVE) {
      throw new Error();
    }

    delete client.client_secret_hash;

    return client;
  } catch (error) {
    throw new InvalidOrExpiredTokenError();
  }
};

module.exports = { authenticateClientByAccessToken };
