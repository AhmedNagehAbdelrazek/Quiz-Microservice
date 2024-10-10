const validator = require("validator");

const { ClientStatus } = require("../enums");
const { ClientEntity } = require("../entities");
const { NotExistError, ValidationError } = require("../errors/common");

const { clientRepository } = require("../../data-access/repositories");

const validatePage = (page) => {
  if (!validator.isInt(String(page), { min: 1 })) {
    throw new ValidationError("Invalid 'page', it must be an integer >= 1");
  }
};

const validateLimit = (limit) => {
  if (!validator.isInt(String(limit), { min: 1 })) {
    throw new ValidationError("Invalid 'limit', it must be an integer >= 1");
  }
};

const validateStatus = (status) => {
  if (!Object.values(ClientStatus).includes(status)) {
    throw new ValidationError("Invalid 'status'.");
  }
};

const createClient = async (name) => {
  const client = new ClientEntity({ name });

  await clientRepository.createClient(client);

  return client.toObject();
};

const renameClient = async (id, name) => {
  const client = await clientRepository.retrieveClient(id);

  if (!client) {
    throw new NotExistError("There is no client with this ID.");
  }

  client.name = name;

  await clientRepository.updateClient(client);

  return client.toObject();
};

const regenerateClientCredentials = async (id) => {
  const client = await clientRepository.retrieveClient(id);

  if (!client) {
    throw new NotExistError("There is no client with this ID.");
  }

  client.regenerateCredentials();

  await clientRepository.updateClient(client);

  return client.toObject();
};

const activateClient = async (id) => {
  const client = await clientRepository.retrieveClient(id);

  if (!client) {
    throw new NotExistError("There is no client with this ID.");
  }

  client.activateClient();

  await clientRepository.updateClient(client);

  return client.toObject();
};

const deactivateClient = async (id) => {
  const client = await clientRepository.retrieveClient(id);

  if (!client) {
    throw new NotExistError("There is no client with this ID.");
  }

  client.deactivateClient();

  await clientRepository.updateClient(client);

  return client.toObject();
};

const retrieveClient = async (id) => {
  const client = await clientRepository.retrieveClient(id);

  if (!client) {
    throw new NotExistError("There is no client with this ID.");
  }

  return client.toObject();
};

const retrieveClientForOAuth = async (client_id) => {
  const client = await clientRepository.retrieveClientForOAuth(client_id);

  if (!client) {
    throw new NotExistError("There is no client with this client_id.");
  }

  return client.toObject();
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

  return {
    clients: clients.map((client) => client.toObject()),
    pagination: { page, totalPages },
  };
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
