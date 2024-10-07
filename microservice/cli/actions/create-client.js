const { clientService } = require("../../business-logic/services");

const createClient = async (name) => {
  const credentials = await clientService.createClient(name);

  console.log(credentials);
};

module.exports = createClient;
