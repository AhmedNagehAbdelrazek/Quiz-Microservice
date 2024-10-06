const Client = require("../models/client");

const createClient = async (name, clientId, clientSecretHash, isEnabled) => {
  const client = await Client.create({
    name,
    clientId,
    clientSecretHash,
    isEnabled,
  });

  return toDTO(client);
};

const updateClient = async (id, update) => {
  const client = await Client.findByIdAndUpdate(id, update, {
    new: true,
  });

  return client ? toDTO(client) : null;
};

const retrieveClientById = async (id) => {
  const client = await Client.findOneById(id);

  return client ? toDTO(client) : null;
};

const retrieveClientByClientId = async (clientId) => {
  const client = await Client.findOne({ clientId });

  return client ? toDTO(client) : null;
};

const retrieveClients = async (skip, limit) => {
  const clients = await Client.find().skip(skip).limit(limit);

  return clients.map(toDTO);
};

const countClients = () => {
  return Client.countDocuments();
};

const toDTO = ({ _id, name, clientId, clientSecretHash, isEnabled }) => {
  return { id: _id.toString(), name, clientId, clientSecretHash, isEnabled };
};

module.exports = {
  createClient,
  updateClient,
  retrieveClientById,
  retrieveClientByClientId,
  retrieveClients,
  countClients,
};
