const { default: mongoose } = require("mongoose");
const { clientService } = require("../../business-logic/services");
const ValidationError = require('../../business-logic/errors/common/validation-error')

const regenerateClientCredentials = async (id) => {
    
    const { newClientId, newClientSecret } = await clientService.regenerateClientCredentials(id)
    console.log({ newClientId, newClientSecret });
  };
  
  module.exports = regenerateClientCredentials;