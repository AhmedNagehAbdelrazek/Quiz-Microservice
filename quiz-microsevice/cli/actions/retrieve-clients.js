const { clientService } = require("../../business-logic/services");

const retrieveAllClients = async (page = 1, limit = 20) => {
  const { clients, pagination } = await clientService.retrieveClients(
    page,
    limit
  );

  clients.forEach((client) => {
    delete client.clientSecretHash;
  });

  console.log({ clients, pagination });
};

module.exports = retrieveAllClients;
