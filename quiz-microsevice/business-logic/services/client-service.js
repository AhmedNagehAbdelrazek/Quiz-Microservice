const validator = require("validator");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const { ValidationError, NotExistError } = require("../errors/common");
const { clientRepository } = require("../../data-access/repositories");

const createOne = async (name) => {
  if (!name || typeof name !== "string") {
    throw ValidationError(
      "Invalid or missing name. It must be a non-empty string."
    );
  }

  if (!validator.isLength(name, { min: 1, max: 32 })) {
    throw ValidationError(
      "Invalid name. It must be between 1 and 32 characters."
    );
  }

  const clientId = crypto.randomBytes(20).toString("hex");
  const clientSecret = crypto.randomBytes(20).toString("hex");

  const clientSecretHash = bcrypt.hashSync(clientSecret, bcrypt.genSaltSync());

  await clientRepository.createOne(name, clientId, clientSecretHash);

  return { clientId, clientSecret };
};

const regenerateClientCredentials = async (id) => {
  if (!validator.isMongoId(id)) {
    throw new ValidationError("Invalid id. It must be a valid MongoId.");
  }

  const clientId = crypto.randomBytes(20).toString("hex");
  const clientSecret = crypto.randomBytes(20).toString("hex");

  const clientSecretHash = bcrypt.hashSync(clientSecret, bcrypt.genSaltSync());

  const client = await clientRepository.updateClientCredentials(
    id,
    clientId,
    clientSecretHash
  );

  if (!client) {
    throw new NotExistError("There is no client with this id.");
  }

  return { clientId, clientSecret };
};

const retrieveOneByClientId = async (clientId) => {
  const client = await clientRepository.retrieveOneByClientId(clientId);

  if (!client) {
    throw new NotExistError("There is no client with this clientId.");
  }

  return client;
};

const retrieveAllClients = async () => {
  const clients = await clientRepository.retrieveAllClients();

  return clients.map(({ id, name, clientId }) => ({ id, name, clientId }));
};

module.exports = {
  createOne,
  retrieveOneByClientId,
  retrieveAllClients,
  regenerateClientCredentials,
};
