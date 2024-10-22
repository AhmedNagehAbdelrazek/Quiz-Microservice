const { getModels } = require("../models");

const toDTO = (user) => {
  return {
    id: user._id,
  };
};

const upsertUser = async (clientId, userId) => {
  const { User } = getModels(clientId);

  const user = await User.findOneAndUpdate(
    { _id: userId },
    {},
    { upsert: true, new: true }
  );

  return toDTO(user);
};

module.exports = { upsertUser };
