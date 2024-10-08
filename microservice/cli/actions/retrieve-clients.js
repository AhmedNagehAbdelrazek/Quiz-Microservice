const { clientService } = require("../../business-logic/services");

const retrieveAllClients = async (page, limit, status) => {
  const { clients, pagination } = await clientService.retrieveClients(
    page,
    limit,
    status
  );

  clients.forEach((client) => {
    delete client.oauthSecretHash;
  });

  console.log({ clients, pagination });
};

module.exports = retrieveAllClients;
