const validator = require("validator");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const { ClientStatus, DeleteType } = require("../enums");
const {
  ValidationError,
  NotExistError,
  InvalidStatusError,
} = require("../errors/common");

const { clientRepository } = require("../../data-access/repositories");

const validateId = async (id) => {
  if (!validator.isUUID(id)) {
    throw new ValidationError("Invalid client ID, it must be a UUID.");
  }
};

const validateName = async (name) => {
  if (
    typeof name !== "string" ||
    !validator.isLength(name, { min: 1, max: 50 })
  ) {
    throw new ValidationError(
      "Invalid 'name', it must be a string between 1 and 50 characters."
    );
  }
};

const validatePage = (page) => {
  if (!validator.isInt(String(page), { min: 1 })) {
    throw new ValidationError(
      "Invalid 'page', it must be an integer greater than one"
    );
  }
};

const validateLimit = (limit) => {
  if (!validator.isInt(String(limit), { min: 1 })) {
    throw new ValidationError(
      "Invalid 'limit', it must be an integer greater than one"
    );
  }
};

const validateStatus = (status) => {
  if (!Object.values(ClientStatus).includes(status)) {
    throw new ValidationError("Invalid 'status'.");
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
    throw new NotExistError("There is no client with this ID.");
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
    throw new NotExistError("There is no client with this ID.");
  }

  return { oauthId, oauthSecret };
};

const deleteClient = async (clientId, type = DeleteType.SOFT) => {
  await validateId(clientId);

  const client = await clientRepository.retrieveClient(clientId);

  if (!client) {
    throw new NotExistError("There is no client with this ID.");
  }

  if (type === DeleteType.SOFT) {
    if (client.status === ClientStatus.DELETED) {
      throw new InvalidStatusError("This client has already been deleted.");
    }

    await clientRepository.updateClient(clientId, {
      status: ClientStatus.DELETED,
    });

    return;
  }

  if (type === DeleteType.HARD) {
    await clientRepository.deleteClient(clientId);

    return;
  }
};

const restoreClient = async (clientId) => {
  await validateId(clientId);

  const client = await clientRepository.retrieveClient(clientId);

  if (!client) {
    throw new NotExistError("There is no client with this ID.");
  }

  if (client.status === ClientStatus.ACTIVE) {
    throw new InvalidStatusError("This client is already active.");
  }

  return clientRepository.updateClient(clientId, {
    status: ClientStatus.ACTIVE,
  });
};

const retrieveClient = async (clientId) => {
  validateId(clientId);

  const client = await clientRepository.retrieveClient(clientId);

  if (!client) {
    throw new NotExistError("There is no client with this ID.");
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
  validateStatus(status);

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
