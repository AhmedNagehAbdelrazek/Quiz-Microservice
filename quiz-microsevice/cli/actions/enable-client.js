const { clientService } = require("../../business-logic/services");

const enableClient = async (id) => {
  const client =  await clientService.enableClient(id);

  console.log({
    id: client.id,
    name: client.name, 
    clientId: client.clientId, 
    isEnabled: client.isEnabled
});
};

module.exports = enableClient;
