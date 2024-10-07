const { clientService } = require("../../business-logic/services");

const renameClient = async (id, name) => {
  const client = await clientService.renameClient(id, name);

  delete client.oauthSecretHash;

  console.log(client);
};

module.exports = renameClient;
