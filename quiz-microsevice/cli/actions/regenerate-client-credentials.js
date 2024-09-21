const { clientService } = require("../../business-logic/services");

const regenerateClientCredentials = async (id) => {
  const { clientId, clientSecret } =
    await clientService.regenerateClientCredentials(id);

  console.log({ clientId, clientSecret });
};

module.exports = regenerateClientCredentials;
