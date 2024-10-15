const clientRepository = require("./client-repository");
const userRepository = require("./user-repository");
const quizRepository = require("./quiz-repository");
const questionRepository = require("./question-repository");
const attemptRepository = require("./attempt-repository");
const responseRepository = require("./response-repository");

module.exports = {
  userRepository,
  clientRepository,
  quizRepository,
  questionRepository,
  attemptRepository,
  responseRepository,
};
