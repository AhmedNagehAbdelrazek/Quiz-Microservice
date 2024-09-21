const Client = require("../models/client");
const { NotExistError } = require("../../business-logic/errors/common");


const toDTO = ({ _id, name, clientId, clientSecretHash }) => {
  return { id: _id.toString(), name, clientId, clientSecretHash };
};

const createOne = async (name, clientId, clientSecretHash) => {
  const client = await Client.create({ name, clientId, clientSecretHash });

  return toDTO(client);
};

const retrieveOneByClientId = async (clientId) => {
  const client = await Client.findOne({ clientId });
  
  return client ? toDTO(client) : null;
};

const retrieveAllClients = async () => {
  
  const clients = await Client.find().select('-clientSecretHash');
  
  return clients.map(toDTO);
  
  
};


const regenerateClientCredentials = async(id, clientId, clientSecretHash) => {
  const client = await Client.findById(id);
  if(!client){
    return null;
  };
  const regenerateClient = await Client.updateOne( { _id: id }, { clientId, clientSecretHash }, {new: true} );
  

  return toDTO(regenerateClient);
};


module.exports = { createOne, retrieveOneByClientId,  retrieveAllClients, regenerateClientCredentials};
