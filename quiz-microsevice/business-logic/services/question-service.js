const { QuestionsTypes } = require("../enums");
const { ValidationError } = require("../errors/common");
const { questionRepository } = require("../../data-access/repositories");
const validator = require("validator");

const MIN_TEXT_LENGTH = 10;
const MAX_TEXT_LENGTH = 500;
const MIN_ANSWER_LENGTH = 1;
const MAX_ANSWER_LENGTH = 200;
const TRUE_FALSE_OPTIONS = ["true", "false"];

// Validation Functions
const validateType = (type) => {
  if (!Object.values(QuestionsTypes).includes(type)) {
    throw new ValidationError("Invalid question type.");
  }
};

const validateText = (text) => {
  if (typeof text !== "string") {
    throw new ValidationError(`Invalid question text, It must be  string.`);
  }

  if (
    !validator.isLength(text.trim(), {
      min: MIN_TEXT_LENGTH,
      max: MAX_TEXT_LENGTH,
    })
  ) {
    throw new ValidationError(
      `Invalid question text, It must be between ${MIN_TEXT_LENGTH} and ${MAX_TEXT_LENGTH} characters.`
    );
  }
};

const validateOptions = (type, options) => {
  if (type === QuestionsTypes.SHORT_ANSWER && options !== null) {
    throw new ValidationError(
      "Invalid question options, Short-Answer questions must have null options."
    );
  }

  if (type === QuestionsTypes.FILL_IN_THE_BLANK && options !== null) {
    throw new ValidationError(
      "Invalid question options, Fill-in-the-Blank questions must have null options."
    );
  }

  if (
    type === QuestionsTypes.TRUE_FALSE &&
    (!Array.isArray(options) ||
      options.length !== 2 ||
      !options.every((opt) => TRUE_FALSE_OPTIONS.includes(opt)))
  ) {
    throw new ValidationError(
      'Invalid question options, True/False questions must have options ["true", "false"].'
    );
  }

  if (
    type !== QuestionsTypes.TRUE_FALSE &&
    (!Array.isArray(options) || !options.every(validator.isAlpha))
  ) {
    throw new ValidationError(
      "Invalid question options, It must be an array of alphabetic strings."
    );
  }
};

const validateAnswer = (type, answer) => {
  if (typeof answer !== "string") {
    throw new ValidationError(`Invalid answer text, It must be  string.`);
  }

  if (
    !validator.isLength(answer.trim(), {
      min: MIN_ANSWER_LENGTH,
      max: MAX_ANSWER_LENGTH,
    })
  ) {
    throw new ValidationError(
      `Invalid question answer, It must be between ${MIN_ANSWER_LENGTH} and ${MAX_ANSWER_LENGTH} characters.`
    );
  }

  if (
    type === QuestionsTypes.TRUE_FALSE &&
    !TRUE_FALSE_OPTIONS.includes(answer)
  ) {
    throw new ValidationError(
      'Invalid question answer, True/False questions must have an answer of "true" or "false".'
    );
  }
};

const validatePoints = (points) => {
  if (!validator.isInt(String(points), { min: 0, max: 100 })) {
    throw new ValidationError(
      "Invalid question points, It must be a number between 0 and 100."
    );
  }
};

// Main createQuestion function
const createQuestion = async (
  client,
  quiz,
  type,
  text,
  options,
  answer,
  points
) => {
  validateType(type);
  validateText(text);
  validateOptions(type, options);
  validateAnswer(type, answer);
  validatePoints(points);

  const question = await questionRepository.createQuestion(
    client.id,
    quiz.id,
    type,
    text,
    options,
    answer,
    points
  );

  return question;
};

const deleteQuestion = async (client, id) => {
  await questionRepository.deleteQuestion(client.id, id);
};

module.exports = { createQuestion, deleteQuestion };
