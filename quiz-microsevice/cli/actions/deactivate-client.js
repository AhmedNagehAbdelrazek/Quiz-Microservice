const { clientService } = require("../../business-logic/services");

const deactivateClient = async (id) => {
  const client = await clientService.deactivateClient(id);

  delete client.clientSecretHash;

  console.log(client);
};

module.exports = deactivateClient;
