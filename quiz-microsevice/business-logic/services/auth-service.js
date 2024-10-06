const jwt = require("jsonwebtoken");

const { ClientStatusTypes } = require("../enums");
const { InvalidOrExpiredTokenError } = require("../errors/auth");

const { clientRepository } = require("../../data-access/repositories");

const JWT_SECRET = process.env.JWT_SECRET;

const authenticate = async (token) => {
  try {
    const { clientId } = jwt.decode(token, JWT_SECRET);

    const client = await clientRepository.retrieveClientByClientId(clientId);

    if (!client || client.status === ClientStatusTypes.INACTIVE) {
      throw new Error();
    }

    delete client.clientSecretHash;

    return client;
  } catch (error) {
    throw new InvalidOrExpiredTokenError();
  }
};

module.exports = { authenticate };
