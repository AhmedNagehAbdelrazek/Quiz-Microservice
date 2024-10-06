const validator = require("validator");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const { ClientStatusTypes } = require("../enums");
const { ValidationError, NotExistError } = require("../errors/common");

const { clientRepository } = require("../../data-access/repositories");

const validateId = async (id) => {
  if (!validator.isMongoId(id)) {
    throw new ValidationError("Invalid client id, it must be a MongoId.");
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

const validatePage = (page) => {
  if (!validator.isInt(String(page), { min: 0 })) {
    throw new ValidationError("Invalid 'page', it must be a positive integer.");
  }
};

const validateLimit = (limit) => {
  if (!validator.isInt(String(limit), { min: 0 })) {
    throw new ValidationError(
      "Invalid 'limit', it must be a positive integer."
    );
  }
};

const createClient = async (name) => {
  await validateName(name);

  const clientId = crypto.randomBytes(20).toString("hex");
  const clientSecret = crypto.randomBytes(20).toString("hex");

  const clientSecretHash = bcrypt.hashSync(clientSecret, bcrypt.genSaltSync());

  await clientRepository.createClient(
    name,
    clientId,
    clientSecretHash,
    ClientStatusTypes.ACTIVE
  );

  return { clientId, clientSecret };
};

const renameClient = async (id, name) => {
  await validateId(id);
  await validateName(name);

  const client = await clientRepository.updateClient(id, { name });

  if (!client) {
    throw new NotExistError("There is no client with this id.");
  }

  return client;
};

const regenerateClientCredentials = async (id) => {
  await validateId(id);

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

const activateClient = async (id) => {
  await validateId(id);

  const client = await clientRepository.updateClient(id, {
    status: ClientStatusTypes.ACTIVE,
  });

  if (!client) {
    throw new NotExistError("There is no client with this id.");
  }

  return client;
};

const deactivateClient = async (id) => {
  await validateId(id);

  const client = await clientRepository.updateClient(id, {
    status: ClientStatusTypes.INACTIVE,
  });

  if (!client) {
    throw new NotExistError("There is no client with this id.");
  }

  return client;
};

const retrieveClientById = async (id) => {
  validateId(id);

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
  validatePage(page);
  validateLimit(limit);

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
  activateClient,
  deactivateClient,
  retrieveClientById,
  retrieveClientByClientId,
  retrieveClients,
};
