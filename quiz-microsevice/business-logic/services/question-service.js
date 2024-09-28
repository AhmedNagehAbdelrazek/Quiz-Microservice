const validator = require("validator");

const { QuestionsTypes } = require("../enums");
const { ValidationError } = require("../errors/common");

const { questionRepository } = require("../../data-access/repositories");

const validateType = (type) => {
  if (!Object.values(QuestionsTypes).includes(type)) {
    throw new ValidationError("Invalid type.");
  }
};

const validateText = (text) => {
  if (typeof text !== "string") {
    throw new ValidationError("Invalid text, It must be  string.");
  }

  if (!validator.isLength(text, { min: 1, max: 1024 })) {
    throw new ValidationError(
      "Invalid text, It must be between 1 and 1024 characters."
    );
  }
};

const validateOptions = (type, options) => {
  if (type === QuestionsTypes.MILTIPLE_CHOICE) {
    if (
      !Array.isArray(options) ||
      !options.every((option) => typeof option === "string")
    ) {
      throw new ValidationError(
        "Invalid options, It must be an array of strings for Multiple-Choice questions."
      );
    }
  }

  if (options !== null) {
    throw new ValidationError(
      "Invalid options, It must be null for question types other than Multiple-Choice."
    );
  }
};

const validateAnswer = (type, options, answer) => {
  if (type === QuestionsTypes.MULTIPLE_CHOICE && !options.includes(answer)) {
    throw new ValidationError(
      "Invalid answer, it must be one of the provided options."
    );
  }

  if (
    type === QuestionsTypes.TRUE_FALSE &&
    !["true", "false"].includes(answer)
  ) {
    throw new ValidationError(
      "Invalid answer, it must be either 'true' or 'false'."
    );
  }

  if (typeof answer !== "string") {
    throw new ValidationError("Invalid answer, it must be a string.");
  }

  if (!validator.isLength(answer, { min: 1, max: 1024 })) {
    throw new ValidationError(
      "Invalid answer, it must be between 1 and 1024 characters."
    );
  }
};

const validatePoints = (points) => {
  if (!validator.isInt(String(points), { min: 0, max: 100 })) {
    throw new ValidationError(
      "Invalid points, It must be a number between 0 and 100."
    );
  }
};

const createQuestion = async (
  clientId,
  quizId,
  type,
  text,
  options,
  answer,
  points
) => {
  validateType(type);
  validateText(text);
  validateOptions(type, options);
  validateAnswer(type, options, answer);
  validatePoints(points);

  const question = await questionRepository.createQuestion(
    clientId,
    quizId,
    type,
    text,
    options,
    answer,
    points
  );

  return question;
};

const deleteQuestion = async (clientId, questionId) => {
  await questionRepository.deleteQuestion(clientId, questionId);
};

const deleteQuestionsForQuiz = async (clientId, quizId) => {
  await questionRepository.deleteQuestionsForQuiz(clientId, quizId);
};

module.exports = { createQuestion, deleteQuestion, deleteQuestionsForQuiz };
