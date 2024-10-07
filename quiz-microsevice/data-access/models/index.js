const Client = require("./client");
const generateQuizModelForClient = require("./quiz");
const generateQuestionModelForClient = require("./question");

const cache = new Map();

const getModelsForClient = (id) => {
  const models = cache.get(id);

  if (models) {
    return models;
  }

  const Quiz = generateQuizModelForClient(id);
  const Question = generateQuestionModelForClient(id);

  cache.set(id, { Quiz, Question });

  return { Quiz, Question };
};

module.exports = {
  Client,
  getModelsForClient,
};
