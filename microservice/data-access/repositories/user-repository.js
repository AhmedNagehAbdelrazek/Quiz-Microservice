const { getModels } = require("../models");

const createUser = async (clientId) => {
    const {User} = getModels(clientId);

    const user = await User.create();

    return toDTO(user);

}

const retrieveUser = async (clientId, userId) => {
    const {User} = getModels(clientId);

    const user = User.findById(userId);

    return user ? toDTO(user) : null;
}

module.exports = {createUser,
    retrieveUser,
};
