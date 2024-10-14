const Client = require("./client");
const generateQuizModel = require("./quiz");
const generateQuestionModel = require("./question");

const cache = new Map();

const getModels = (id) => {
  const models = cache.get(id);

  if (models) {
    return models;
  }

  const Quiz = generateQuizModel(id);
  const Question = generateQuestionModel(id);

  cache.set(id, { Quiz, Question });

  return { Quiz, Question };
};

module.exports = {
  Client,
  getModels,
};
