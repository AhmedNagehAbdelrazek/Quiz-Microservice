const { clientService } = require("../../business-logic/services");

const renameClient = async (id, name) => {
  const client = await clientService.renameClient(id, name);

  console.log({id: client.id, name: client.name, clientId: client.clientId});
};

module.exports = renameClient;

