const validator = require("validator");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const { ClientStatus } = require("../enums");
const {
  ValidationError,
  NotExistError,
  InvalidStatusError,
} = require("../errors/common");

const { clientRepository } = require("../../data-access/repositories");

const validateId = async (id) => {
  if (!validator.isUUID(id)) {
    throw new ValidationError("Invalid client id, it must be a UUID.");
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

  const oauthId = crypto.randomBytes(20).toString("hex");
  const oauthSecret = crypto.randomBytes(20).toString("hex");

  const oauthSecretHash = bcrypt.hashSync(oauthSecret, bcrypt.genSaltSync());

  await clientRepository.createClient(
    name,
    oauthId,
    oauthSecretHash,
    ClientStatus.ACTIVE
  );

  return { oauthId, oauthSecret };
};

const renameClient = async (clientId, name) => {
  await validateId(clientId);
  await validateName(name);

  const client = await clientRepository.updateClient(clientId, { name });

  if (!client) {
    throw new NotExistError("There is no client with this id.");
  }

  return client;
};

const regenerateClientCredentials = async (clientId) => {
  await validateId(clientId);

  const oauthId = crypto.randomBytes(20).toString("hex");
  const oauthSecret = crypto.randomBytes(20).toString("hex");

  const oauthSecretHash = bcrypt.hashSync(oauthSecret, bcrypt.genSaltSync());

  const client = await clientRepository.updateClient(clientId, {
    oauthId,
    oauthSecretHash,
  });

  if (!client) {
    throw new NotExistError("There is no client with this id.");
  }

  return { oauthId, oauthSecret };
};

const deleteClient = async (clientId) => {
  await validateId(clientId);

  const client = await clientRepository.retrieveClient(clientId);

  if (!client) {
    throw new NotExistError("There is no client with this id.");
  }

  if (client.status === ClientStatus.DELETED) {
    throw new InvalidStatusError("This client already deleted.");
  }

  return clientRepository.updateClient(clientId, {
    status: ClientStatus.DELETED,
  });
};

const restoreClient = async (clientId) => {
  await validateId(clientId);

  const client = await clientRepository.retrieveClient(clientId);

  if (!client) {
    throw new NotExistError("There is no client with this id.");
  }

  if (client.status === ClientStatus.ACTIVE) {
    throw new InvalidStatusError("This client already active.");
  }

  return clientRepository.updateClient(clientId, {
    status: ClientStatus.ACTIVE,
  });
};

const retrieveClient = async (clientId) => {
  validateId(clientId);

  const client = await clientRepository.retrieveClient(clientId);

  if (!client) {
    throw new NotExistError("There is no client with this clientId.");
  }

  return client;
};

const retrieveClientByOAuthId = async (oauthId) => {
  const client = await clientRepository.retrieveClientByOAuthId(oauthId);

  if (!client) {
    throw new NotExistError("There is no client with this oauthId.");
  }

  return client;
};

const retrieveClients = async (
  page = 1,
  limit = 20,
  status = ClientStatus.ACTIVE
) => {
  validatePage(page);
  validateLimit(limit);

  const clients = await clientRepository.retrieveClients(
    (page - 1) * limit,
    limit,
    status
  );

  const totalCount = await clientRepository.countClients(status);
  const totalPages = Math.ceil(totalCount / limit);

  return { clients, pagination: { page, totalPages } };
};

module.exports = {
  createClient,
  renameClient,
  regenerateClientCredentials,
  deleteClient,
  restoreClient,
  retrieveClient,
  retrieveClientByOAuthId,
  retrieveClients,
};
