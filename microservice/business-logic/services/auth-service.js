const jwt = require("jsonwebtoken");

const { ClientStatus } = require("../enums");
const { InvalidOrExpiredTokenError } = require("../errors/auth");

const { clientRepository } = require("../../data-access/repositories");

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateClientByToken = async (token) => {
  try {
    const { clientId } = jwt.decode(token, JWT_SECRET);

    const client = await clientRepository.retrieveClientByOAuthId(clientId);

    if (!client || client.status === ClientStatus.DELETED) {
      throw new Error();
    }

    delete client.oauthSecretHash;

    return client;
  } catch (error) {
    throw new InvalidOrExpiredTokenError();
  }
};

module.exports = { authenticateClientByToken };
