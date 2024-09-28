const validator = require("validator");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const { ValidationError, NotExistError } = require("../errors/common");
const { clientRepository } = require("../../data-access/repositories");

const validateName = async (name) => {
  if (!name || typeof name !== "string") {
    throw new ValidationError(
      "Invalid or missing name. It must be a non-empty string."
    );
  }
  if (!validator.isLength(name, { min: 1, max: 32 })) {
    throw new ValidationError(
      "Invalid name. It must be between 1 and 32 characters."
    );
  }
};

const validatId = async (id) => {
  if (!validator.isMongoId(id)) {
    throw new ValidationError("Invalid id. It must be a valid MongoId.");
  }
};

const createOne = async (name) => {
  await validateName(name);

  const clientId = crypto.randomBytes(20).toString("hex");
  const clientSecret = crypto.randomBytes(20).toString("hex");

  const clientSecretHash = bcrypt.hashSync(clientSecret, bcrypt.genSaltSync());

  await clientRepository.createOne(name, clientId, clientSecretHash);

  return { clientId, clientSecret };
};

const regenerateClientCredentials = async (id) => {
  await validatId(id);
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

  return clients.map(({ id, name, clientId, isEnabled }) => ({
    id,
    name,
    clientId,
    isEnabled,
  }));
};

const renameClient = async (id, name) => {
  await validatId(id);
  await validateName(name);

  const client = await clientRepository.renameClient(id, name);
  if (!client) {
    throw new NotExistError("There is no client with this id.");
  }
  return {
    id: client.id,
    name: client.name,
    clientId: client.clientId,
    isEnabled: client.isEnabled,
  };
};

const disableClient = async (id) => {
  await validatId(id);
  const client = await clientRepository.disableClient(id);
  if (!client) {
    throw new NotExistError("There is no client with this id.");
  }
  return {
    id: client.id,
    name: client.name,
    clientId: client.clientId,
    isEnabled: client.isEnabled,
  };
};

const enableClient = async (id) => {
  await validatId(id);
  const client = await clientRepository.enableClient(id);
  if (!client) {
    throw new NotExistError("There is no client with this id.");
  }
  return {
    id: client.id,
    name: client.name,
    clientId: client.clientId,
    isEnabled: client.isEnabled,
  };
};

module.exports = {
  createOne,
  retrieveOneByClientId,
  retrieveAllClients,
  regenerateClientCredentials,
  renameClient,
  disableClient,
  enableClient,
};
