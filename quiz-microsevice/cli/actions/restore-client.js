const { clientService } = require("../../business-logic/services");

const restoreClient = async (id) => {
  const client = await clientService.restoreClient(id);

  delete client.oauthSecretHash;

  console.log(client);
};

module.exports = restoreClient;
