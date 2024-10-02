const { clientService } = require("../../business-logic/services");

const enableClient = async (id) => {
  const client = await clientService.enableClient(id);

  delete client.clientSecretHash;

  console.log(client);
};

module.exports = enableClient;
