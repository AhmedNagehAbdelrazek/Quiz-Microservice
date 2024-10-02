const validator = require("validator");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const { ValidationError, NotExistError } = require("../errors/common");

const { clientRepository } = require("../../data-access/repositories");

const validatId = async (id) => {
  if (!validator.isMongoId(id)) {
    throw new ValidationError("Invalid client id, it must be a valid MongoId.");
  }
};

const validateName = async (name) => {
  if (
    typeof name !== "string" ||
    !validator.isLength(name, { min: 1, max: 50 })
  ) {
    throw new ValidationError(
      "Invalid name, it must be a string between 1 and 50 characters."
    );
  }
};

const createClient = async (name) => {
  await validateName(name);

  const clientId = crypto.randomBytes(20).toString("hex");
  const clientSecret = crypto.randomBytes(20).toString("hex");

  const clientSecretHash = bcrypt.hashSync(clientSecret, bcrypt.genSaltSync());

  await clientRepository.createClient(name, clientId, clientSecretHash, true);

  return { clientId, clientSecret };
};

const renameClient = async (id, name) => {
  await validatId(id);
  await validateName(name);

  const client = await clientRepository.updateClient(id, { name });

  if (!client) {
    throw new NotExistError("There is no client with this id.");
  }

  return client;
};

const regenerateClientCredentials = async (id) => {
  await validatId(id);

  const clientId = crypto.randomBytes(20).toString("hex");
  const clientSecret = crypto.randomBytes(20).toString("hex");

  const clientSecretHash = bcrypt.hashSync(clientSecret, bcrypt.genSaltSync());

  const client = await clientRepository.updateClient(id, {
    clientId,
    clientSecretHash,
  });

  if (!client) {
    throw new NotExistError("There is no client with this id.");
  }

  return { clientId, clientSecret };
};

const enableClient = async (id) => {
  await validatId(id);

  const client = await clientRepository.updateClient(id, { enabled: true });

  if (!client) {
    throw new NotExistError("There is no client with this id.");
  }

  return client;
};

const disableClient = async (id) => {
  await validatId(id);

  const client = await clientRepository.updateClient(id, { enabled: false });

  if (!client) {
    throw new NotExistError("There is no client with this id.");
  }

  return client;
};

const retrieveClientById = async (id) => {
  validatId(id);

  const client = await clientRepository.retrieveClientById(id);

  if (!client) {
    throw new NotExistError("There is no client with this clientId.");
  }

  return client;
};

const retrieveClientByClientId = async (clientId) => {
  const client = await clientRepository.retrieveClientByClientId(clientId);

  if (!client) {
    throw new NotExistError("There is no client with this clientId.");
  }

  return client;
};

const retrieveClients = async (page = 1, limit = 20) => {
  const clients = await clientRepository.retrieveClients(
    (page - 1) * limit,
    limit
  );

  const totalCount = await clientRepository.countClients();
  const totalPages = Math.ceil(totalCount / limit);

  return { clients, pagination: { page, totalPages } };
};

module.exports = {
  createClient,
  renameClient,
  regenerateClientCredentials,
  enableClient,
  disableClient,
  retrieveClientById,
  retrieveClientByClientId,
  retrieveClients,
};
