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
  
  return clients.length > 0 ? clients : [];
  
  
};

/* 
Here I make GET request to get ObjectID, not clientId.
So I'm using (findById) method, not findOne.
*/
const regenerateClientCredentials = async(id, clientId, clientSecretHash) => {
  const client = await Client.findById(id);
  if(!client){
    // console.log('hello')
    throw new NotExistError("There is no client with this ObjectID.");
  };
  const regenerateClient = await Client.updateOne( { _id: id }, { clientId, clientSecretHash } );
  const updatedClient = await Client.findById(id);

  return toDTO(updatedClient);
};


module.exports = { createOne, retrieveOneByClientId,  retrieveAllClients, regenerateClientCredentials};
