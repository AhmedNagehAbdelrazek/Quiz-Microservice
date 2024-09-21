const { clientService } = require("../../business-logic/services");

const retrieveAllClients = async () => {
  const clients = await clientService.retrieveAllClients();

  console.log(clients);
};

module.exports = retrieveAllClients;
