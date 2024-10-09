const clientService = require("./client-service");
const oauthService = require("./oauth-service");
const authService = require("./auth-service");
const userService = require("./user-service");
const quizService = require("./quiz-service");
const attemptService = require("./attempt-service");
const questionService = require("./question-service");
const answerService = require("./answer-service");

module.exports = {
  clientService,
  oauthService,
  authService,
  userService,
  quizService,
  attemptService,
  questionService,
  answerService,
};
