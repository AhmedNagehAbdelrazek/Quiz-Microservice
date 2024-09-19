const Client = require("../models/client");

const toDTO = ({ _id, name, clientId, clientSecretHash }) => {
  return { id: _id.toString(), name, clientId, clientSecretHash };
};

const createOne = async (name, clientId, clientSecretHash) => {
  const client = await Client.create({ name, clientId, clientSecretHash });

  return toDTO(client);
};

const retrieveOneByClientId = async (clientId) => {
  const client = await Client.findOne({ clientId });

  return client ? toDTO(client) : null;
};

module.exports = { createOne, retrieveOneByClientId };
