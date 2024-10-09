const createClient = require("./create-client");
const renameClient = require("./rename-client");
const regenerateClientCredentials = require("./regenerate-client-credentials");
const activateClient = require("./activate-client");
const deactivateClient = require("./deavtivate-client");
const retrieveClients = require("./retrieve-clients");

module.exports = {
  createClient,
  renameClient,
  regenerateClientCredentials,
  activateClient,
  deactivateClient,
  retrieveClients,
};
