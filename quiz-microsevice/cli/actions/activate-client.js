const { clientService } = require("../../business-logic/services");

const activateClient = async (id) => {
  const client = await clientService.activateClient(id);

  delete client.clientSecretHash;

  console.log(client);
};

module.exports = activateClient;
