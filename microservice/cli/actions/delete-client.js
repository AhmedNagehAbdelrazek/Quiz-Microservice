const { clientService } = require("../../business-logic/services");

const deleteClient = async (id, type) => {
  await clientService.deleteClient(id, type);
};

module.exports = deleteClient;
