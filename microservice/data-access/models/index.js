const Client = require("./client");
const generateUserModelForClient = require("./user");
const generateQuizModelForClient = require("./quiz");
const generateAttemptModelForClient = require("./attempt");
const generateQuestionModelForClient = require("./question");
const generateAnswerModelForClient = require("./answer");

const cache = new Map();

const getModelsForClient = (id) => {
  const models = cache.get(id);

  if (models) {
    return models;
  }

  const User = generateUserModelForClient(id);
  const Quiz = generateQuizModelForClient(id);
  const Attempt = generateAttemptModelForClient(id);
  const Question = generateQuestionModelForClient(id);
  const Answer = generateAnswerModelForClient(id);

  cache.set(id, { User, Quiz, Attempt, Question, Answer });

  return { User, Quiz, Attempt, Question, Answer };
};

module.exports = {
  Client,
  getModelsForClient,
};
