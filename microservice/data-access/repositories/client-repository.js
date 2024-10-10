const { Client } = require("../models");
const { ClientEntity } = require("../../business-logic/entities");

const createClient = async (client) => {
  const { id, name, client_id, client_secret, status } = client.toObject();

  await Client.create({ _id: id, name, client_id, client_secret, status });
};

const updateClient = async (client) => {
  const { id, name, client_id, client_secret, status } = client.toObject();

  await Client.findByIdAndUpdate(id, {
    name,
    client_id,
    client_secret,
    status,
  });
};

const retrieveClient = async (id) => {
  const client = await Client.findById(id);

  return client ? toEntity(client) : null;
};

const retrieveClientForAuth = async (client_id) => {
  const client = await Client.findOne({ client_id });

  return client ? toEntity(client) : null;
};

const retrieveClients = async (filter, pagination) => {
  const clients = await Client.find(filter)
    .skip(pagination.skip)
    .limit(pagination.limit);

  return clients.map(toEntity);
};

const countClients = (filter) => {
  return Client.countDocuments(filter);
};

const toEntity = (client) => {
  return new ClientEntity({
    id: client._id,
    name: client.name,
    client_id: client.client_id,
    client_secret: client.client_secret,
    status: client.status,
  });
};

module.exports = {
  createClient,
  updateClient,
  retrieveClient,
  retrieveClientForAuth,
  retrieveClients,
  countClients,
};
