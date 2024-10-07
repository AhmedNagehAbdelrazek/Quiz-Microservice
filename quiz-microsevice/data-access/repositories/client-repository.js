const Client = require("../models/client");

const createClient = async (name, oauthId, oauthSecretHash, status) => {
  const client = await Client.create({
    name,
    oauthId,
    oauthSecretHash,
    status,
  });

  return toDTO(client);
};

const updateClient = async (clientId, update) => {
  const client = await Client.findByIdAndUpdate(clientId, update, {
    new: true,
  });

  return client ? toDTO(client) : null;
};

const retrieveClient = async (clientId) => {
  const client = await Client.findById(clientId);

  return client ? toDTO(client) : null;
};

const retrieveClientByOAuthId = async (oauthId) => {
  const client = await Client.findOne({ oauthId });

  return client ? toDTO(client) : null;
};

const retrieveClients = async (skip, limit, status) => {
  const clients = await Client.find({ status }).skip(skip).limit(limit);

  return clients.map(toDTO);
};

const countClients = (status) => {
  return Client.countDocuments({ status });
};

const toDTO = ({ _id, name, oauthId, oauthSecretHash, status }) => {
  return { id: _id.toString(), name, oauthId, oauthSecretHash, status };
};

module.exports = {
  createClient,
  updateClient,
  retrieveClient,
  retrieveClientByOAuthId,
  retrieveClients,
  countClients,
};
