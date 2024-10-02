const { clientService } = require("../../business-logic/services");

const disableClient = async (id) => {
  const client = await clientService.disableClient(id);

  delete client.clientSecretHash;

  console.log(client);
};

module.exports = disableClient;
