const { clientService } = require("../../business-logic/services");

const retrieveClients = async ({ status }, { page, limit }) => {
  const { clients, pagination } = await clientService.retrieveClients(
    { status },
    { page, limit }
  );

  clients.forEach((client) => {
    delete client.client_secret_hash;
  });

  console.log({ clients, pagination });
};

module.exports = retrieveClients;
