const { Client } = require("../models");

const createClient = async (data) => {
  const client = await Client.create(data);

  return toDTO(client);
};

const updateClient = async (clientId, data) => {
  const client = await Client.findByIdAndUpdate(clientId, data, {
    new: true,
  });

  return client ? toDTO(client) : null;
};

const retrieveClient = async (clientId) => {
  const client = await Client.findById(clientId);

  return client ? toDTO(client) : null;
};

const retrieveClientForOAuth = async (client_id) => {
  const client = await Client.findOne({ client_id });

  return client ? toDTO(client) : null;
};

const retrieveClients = async (filter, pagination) => {
  const clients = await Client.find(filter)
    .skip(pagination.skip)
    .limit(pagination.limit);

  return clients.map(toDTO);
};

const countClients = (filter) => {
  return Client.countDocuments(filter);
};

const toDTO = (client) => {
  return {
    id: client._id,
    name: client.name,
    client_id: client.client_id,
    client_secret_hash: client.client_secret_hash,
    status: client.status,
  };
};

module.exports = {
  createClient,
  updateClient,
  retrieveClient,
  retrieveClientForOAuth,
  retrieveClients,
  countClients,
};
