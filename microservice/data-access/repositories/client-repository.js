const { Client } = require("../models");

const createClient = async ({
  name,
  client_id,
  client_secret_hash,
  status,
}) => {
  const client = await Client.create({
    name,
    client_id,
    client_secret_hash,
    status,
  });

  return toDTO(client);
};

const updateClient = async (
  clientId,
  { name, client_id, client_secret_hash, status }
) => {
  const client = await Client.findByIdAndUpdate(
    clientId,
    {
      name,
      client_id,
      client_secret_hash,
      status,
    },
    {
      new: true,
    }
  );

  return client ? toDTO(client) : null;
};

const retrieveClient = async (clientId) => {
  const client = await Client.findById(clientId);

  return client ? toDTO(client) : null;
};

const retrieveClientForAuth = async (client_id) => {
  const client = await Client.findOne({ client_id });

  return client ? toDTO(client) : null;
};

const retrieveClients = async ({ status }, { skip, limit }) => {
  const clients = await Client.find({ status }).skip(skip).limit(limit);

  return clients.map(toDTO);
};

const countClients = ({ status }) => {
  return Client.countDocuments({ status });
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
  retrieveClientForAuth,
  retrieveClients,
  countClients,
};
