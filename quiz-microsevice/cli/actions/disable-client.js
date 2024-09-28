const { clientService } = require("../../business-logic/services");

const disableClient = async (id) => {
  const client =  await clientService.disableClient(id);

  console.log({
    id: client.id,
    name: client.name, 
    clientId: client.clientId, 
    isEnabled: client.isEnabled
});
};

module.exports = disableClient;
