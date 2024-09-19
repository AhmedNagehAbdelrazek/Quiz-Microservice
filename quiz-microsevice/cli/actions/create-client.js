const { clientService } = require("../../business-logic/services");

const createClient = async (name) => {
  const { clientId, clientSecret } = await clientService.createOne(name);

  console.log({ clientId, clientSecret });
};

module.exports = createClient;
