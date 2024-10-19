const { getModels } = require("../models");
const { retrieveClient } = require("./client-repository");

const createAttempt = async (clientId, data) => {
    const {Attempt} = getModels(clientId)
    const {userId, quizId, startedAt, status} = data;

    const attempt = await Attempt.create({
        userId,
        quizId,
        startedAt,
        status
    });
    
    return attempt;
}

const findActiveAttempts = async (clientId, data ) => {
    const {Attempt} = getModels(clientId);
    const {userId, quizId} = data;

    const attempt = await Attempt.findOne({
        userId,
        quizId,
        sumbittedAt: null,
    });

    return attempt ? toDTO(attempt) : null;
}

const countattempts = async (clientId, userId) => {
    const {Attempt} = getModels(clientId);

    const numberOfAttempts = await Attempt.countDocuments({userId});
    return numberOfAttempts;
}
module.exports = {};
