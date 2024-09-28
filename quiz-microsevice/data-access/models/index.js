const Client = require("./client");
const generateQuizModelForClient = require("./quiz");
const generateQuestionModelForClient = require("./question");

const map = new Map();

const getModelsForClient = (id) => {
  const models = map.get(id);

  if (models) {
    return models;
  }

  const Quiz = generateQuizModelForClient(id);
  const Question = generateQuestionModelForClient(id);

  map.set(id, { Quiz, Question });

  return { Quiz, Question };
};

module.exports = {
  Client,
  getModelsForClient,
};
