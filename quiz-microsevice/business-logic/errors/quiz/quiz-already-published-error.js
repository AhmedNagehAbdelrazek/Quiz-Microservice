class QuizAlreadyPublishedError extends Error {
  constructor(message = "Quiz already published.") {
    super(message);
  }
}

module.exports = QuizAlreadyPublishedError;
