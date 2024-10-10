const { clientService } = require("../../business-logic/services");

const regenerateClientCredentials = async (id) => {
  const client = await clientService.regenerateClientCredentials(id);

  console.log(client);
};

module.exports = regenerateClientCredentials;
