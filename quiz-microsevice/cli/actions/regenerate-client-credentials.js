const { default: mongoose } = require("mongoose");
const { clientService } = require("../../business-logic/services");
const ValidationError = require('../../business-logic/errors/common/validation-error')

const regenerateClientCredentials = async (id) => {
    
    // const vaildId = mongoose.Types.ObjectId.isValid(id)
    // if (!vaildId) {
    //     console.log('hello')
    //     throw new ValidationError("Invalid ID format.");
    // }
    
    const { newClientId, newClientSecret } = await clientService.regenerateClientCredentials(id)
    console.log({ newClientId, newClientSecret });
  };
  
  module.exports = regenerateClientCredentials;