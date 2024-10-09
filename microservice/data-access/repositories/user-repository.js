const { getModelsForClient } = require("../models");

const createUser = async (clientId, data) => {
  const { User } = getModelsForClient(clientId);

  const user = await User.create(data);

  return toDTO(user);
};

const toDTO = (user) => {
  return {
    id: user._id,
  };
};

module.exports = { createUser };
