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

  const client_id = crypto.randomBytes(20).toString("hex");
  const client_secret = crypto.randomBytes(20).toString("hex");

  const client_secret_hash = bcrypt.hashSync(
    client_secret,
    bcrypt.genSaltSync()
  );

  await clientRepository.createClient({
    name,
    client_id,
    client_secret_hash,
    status: ClientStatus.ACTIVE,
  });

  return { client_id, client_secret };
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

  const client_id = crypto.randomBytes(20).toString("hex");
  const client_secret = crypto.randomBytes(20).toString("hex");

  const client_secret_hash = bcrypt.hashSync(
    client_secret,
    bcrypt.genSaltSync()
  );

  const client = await clientRepository.updateClient(clientId, {
    client_id,
    client_secret_hash,
  });

  if (!client) {
    throw new NotExistError("There is no client with this ID.");
  }

  return { client_id, client_secret };
};

const activateClient = async (clientId) => {
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

const deactivateClient = async (clientId) => {
  await validateId(clientId);

  const client = await clientRepository.retrieveClient(clientId);

  if (!client) {
    throw new NotExistError("There is no client with this ID.");
  }

  if (client.status === ClientStatus.INACTIVE) {
    throw new InvalidStatusError("This client is already inactive.");
  }

  return clientRepository.updateClient(clientId, {
    status: ClientStatus.INACTIVE,
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

const retrieveClientForOAuth = async (client_id) => {
  const client = await clientRepository.retrieveClientForOAuth(client_id);

  if (!client) {
    throw new NotExistError("There is no client with this client_id.");
  }

  return client;
};

const retrieveClients = async (filter, pagination) => {
  const { status = ClientStatus.ACTIVE } = filter;
  let { page = 1, limit = 20 } = pagination;

  validatePage(page);
  validateLimit(limit);
  validateStatus(status);

  page = Number(page);
  limit = Number(limit);

  const clients = await clientRepository.retrieveClients(
    { status },
    {
      skip: (page - 1) * limit,
      limit,
    }
  );

  const totalCount = await clientRepository.countClients({ status });
  const totalPages = Math.ceil(totalCount / limit);

  return { clients, pagination: { page, totalPages } };
};

module.exports = {
  createClient,
  renameClient,
  regenerateClientCredentials,
  activateClient,
  deactivateClient,
  retrieveClient,
  retrieveClientForOAuth,
  retrieveClients,
};
