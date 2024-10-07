const createClient = require("./create-client");
const renameClient = require("./rename-client");
const regenerateClientCredentials = require("./regenerate-client-credentials");
const deleteClient = require("./delete-client");
const restoreClient = require("./restore-client");
const retrieveClients = require("./retrieve-clients");

module.exports = {
  createClient,
  renameClient,
  regenerateClientCredentials,
  deleteClient,
  restoreClient,
  retrieveClients,
};
