const { clientService } = require("../../business-logic/services");

const regenerateClientCredentials = async (id) => {
  const credentials = await clientService.regenerateClientCredentials(id);

  console.log(credentials);
};

module.exports = regenerateClientCredentials;
