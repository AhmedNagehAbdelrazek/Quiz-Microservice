const validator = require("validator");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const { ValidationError, NotExistError } = require("../errors/common");
const { clientRepository } = require("../../data-access/repositories");

const createOne = async (name) => {
  if (!name || typeof name !== "string") {
    throw ValidationError(
      "Invalid or missing name. It must be a non-empty string."
    );
  }

  if (!validator.isLength(name, { min: 1, max: 32 })) {
    throw ValidationError(
      "Invalid name. It must be between 1 and 32 characters."
    );
  }

  const clientId = crypto.randomBytes(20).toString("hex");
  const clientSecret = crypto.randomBytes(20).toString("hex");

  const clientSecretHash = bcrypt.hashSync(clientSecret, bcrypt.genSaltSync());

  await clientRepository.createOne(name, clientId, clientSecretHash);

  return { clientId, clientSecret };
};



const regenerateClientCredentials = async(id) => {

  const newClientId = crypto.randomBytes(20).toString('hex');
  const newClientSecret = crypto.randomBytes(20).toString('hex');

  const newClientSecretHash = bcrypt.hashSync(newClientSecret, bcrypt.genSaltSync());

  await clientRepository.regenerateClientCredentials(id, newClientId, newClientSecretHash);

  return {newClientId, newClientSecret};
}


const retrieveOneByClientId = async (clientId) => {
  const client = await clientRepository.retrieveOneByClientId(clientId);

  if (!client) {
    // console.log('hello')
    throw new NotExistError("There is no client with this clientId.");
  }

  return client;
};

const retrieveAllClients = async() => {
  const clients = await clientRepository.retrieveAllClients();
  if(!clients){
    throw new NotExistError("There is no clients.")
  }
  return clients;
};


module.exports = { 
  createOne, 
  retrieveOneByClientId, 
  retrieveAllClients, 
  regenerateClientCredentials
};
