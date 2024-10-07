const { clientService } = require("../../business-logic/services");

const deleteClient = async (id) => {
  const client = await clientService.deleteClient(id);

  delete client.oauthSecretHash;

  console.log(client);
};

module.exports = deleteClient;
