const { clientService } = require("../../business-logic/services");

const createClient = async (name) => {
  const client = await clientService.createClient(name);

  console.log(client);
};

module.exports = createClient;
