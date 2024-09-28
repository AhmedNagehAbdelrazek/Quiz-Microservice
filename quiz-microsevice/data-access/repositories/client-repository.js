const Client = require("../models/client");
const { NotExistError } = require("../../business-logic/errors/common");

const toDTO = ({ _id, name, clientId, clientSecretHash, isEnabled}) => {
  return { id: _id.toString(), name, clientId, clientSecretHash, isEnabled};
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
  const clients = await Client.find();

  return clients.map(toDTO);
};

const updateClientCredentials = async (id, clientId, clientSecretHash) => {
  const client = await Client.findByIdAndUpdate(
    { _id: id },
    { clientId, clientSecretHash },
    { new: true }
  );

  if (!client) {
    return null;
  }

  return toDTO(client);
};


const renameClient = async(id, name) =>{
  const client = await Client.findByIdAndUpdate({_id: id}, {name: name}, {new: true})
  if(!client){
    return null;
  };
  return toDTO(client);
};

const disableClient = async(id) => {
  const client = await Client.findByIdAndUpdate({_id: id}, {isEnabled: false}, {new: true});
  if(!client){
    return null;
  };
  return toDTO(client);

}
const enableClient = async(id) => {
  const client = await Client.findByIdAndUpdate({_id: id}, {isEnabled: true}, {new: true});
  if(!client){
    return null;
  };
  return toDTO(client);

}

module.exports = {
  createOne,
  retrieveOneByClientId,
  retrieveAllClients,
  updateClientCredentials,
  renameClient,
  disableClient,
  enableClient,
};
