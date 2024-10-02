const { clientService } = require("../../business-logic/services");

const renameClient = async (id, name) => {
  const client = await clientService.renameClient(id, name);

  delete client.clientSecretHash;

  console.log(client);
};

module.exports = renameClient;
