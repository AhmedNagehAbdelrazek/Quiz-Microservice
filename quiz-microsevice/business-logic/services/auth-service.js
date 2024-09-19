const jwt = require("jsonwebtoken");

const { InvalidOrExpiredTokenError } = require("../errors/auth");

const { clientRepository } = require("../../data-access/repositories");

const JWT_SECRET = process.env.JWT_SECRET;

const authenticate = async (token) => {
  try {
    const decoded = jwt.decode(token, JWT_SECRET);

    const client = await clientRepository.retrieveOneByClientId(
      decoded.clientId
    );

    if (!client) {
      throw Error();
    }

    return client;
  } catch (error) {
    throw new InvalidOrExpiredTokenError();
  }
};

module.exports = { authenticate };
