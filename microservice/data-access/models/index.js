const Client = require("./client");
const generateUserModel = require("./user");
const generateQuizModel = require("./quiz");
const generateQuestionModel = require("./question");
const generateAttemptModel = require("./attempt");
const generateResponseModel = require("./response");

const cache = new Map();

const getModels = (id) => {
  const models = cache.get(id);

  if (models) {
    return models;
  }

  const User = generateUserModel(id);
  const Quiz = generateQuizModel(id);
  const Question = generateQuestionModel(id);
  const Attempt = generateAttemptModel(id);
  const Response = generateResponseModel(id);

  cache.set(id, { User, Quiz, Question, Attempt, Response });

  return { User, Quiz, Question, Attempt, Response };
};

module.exports = {
  Client,
  getModels,
};
