const Client = require("../models/client");

const toDTO = ({ _id, name, clientId, clientSecretHash, enabled }) => {
  return { id: _id.toString(), name, clientId, clientSecretHash, enabled };
};

const createClient = async (name, clientId, clientSecretHash, enabled) => {
  const client = await Client.create({
    name,
    clientId,
    clientSecretHash,
    enabled,
  });

  return toDTO(client);
};

const updateClient = async (id, update) => {
  const client = await Client.findByIdAndUpdate({ _id: id }, update, {
    new: true,
  });

  if (!client) {
    return null;
  }

  return toDTO(client);
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

module.exports = {
  createClient,
  updateClient,
  retrieveClientById,
  retrieveClientByClientId,
  retrieveClients,
  countClients,
};
