const validator = require("validator");

const { QuestionsType } = require("../enums");
const { ValidationError, NotExistError } = require("../errors/common");

const { questionRepository } = require("../../data-access/repositories");

// Constants

const TEXT_LENGTH = { min: 1, max: 500 };
const POINTS_RANGE = { min: 0, max: 10 };

// Validations

const validateId = (id) => {
  if (!validator.isUUID(id)) {
    throw new ValidationError("Invalid question ID, it must be a UUID.");
  }
};

const validateType = (type) => {
  if (!Object.values(QuestionsType).includes(type)) {
    throw new ValidationError("Invalid 'type'.");
  }
};

const validateText = (text) => {
  if (typeof text !== "string" || !validator.isLength(text, TEXT_LENGTH)) {
    throw new ValidationError(
      `Invalid 'text', it must be a string between ${TEXT_LENGTH.min} and ${TEXT_LENGTH.max} characters.`
    );
  }
};

const validateOptions = (type, options) => {
  switch (type) {
    case QuestionsType.MILTIPLE_CHOICE: {
      if (
        !Array.isArray(options) ||
        !options.every((option) => typeof option === "string")
      ) {
        throw new ValidationError(
          "Invalid 'options', it must be an array of strings for Multiple-Choice questions."
        );
      }

      break;
    }

    default: {
      if (options !== null) {
        throw new ValidationError(
          "Invalid 'options', it must be null for question types other than Multiple-Choice."
        );
      }
    }
  }
};

const validateAnswer = (type, options, answer) => {
  switch (type) {
    case QuestionsType.MILTIPLE_CHOICE:
      if (!options.includes(answer)) {
        throw new ValidationError(
          "Invalid 'answer', it must be one of the provided options for Multiple-Choice questions."
        );
      }

      break;

    case QuestionsType.TRUE_FALSE:
      if (typeof answer !== "boolean") {
        throw new ValidationError(
          "Invalid 'answer', it must be a boolean for True/False questions."
        );
      }

      break;

    case QuestionsType.FILL_IN_THE_BLANK:
      if (typeof answer !== "string") {
        throw new ValidationError(
          "Invalid 'answer', it must be a string Fill-In-The-Blank questions."
        );
      }

      break;
  }
};

const validatePoints = (points) => {
  if (!validator.isInt(String(points), POINTS_RANGE)) {
    throw new ValidationError(
      `Invalid 'points', it must be a number between ${POINTS_RANGE.min} and ${POINTS_RANGE.max}.`
    );
  }
};

// Use Cases

const createQuestion = async (
  clientId,
  { type, text, options, answer, points } = {}
) => {
  validateType(type);
  validateText(text);
  validateOptions(type, options);
  validateAnswer(type, options, answer);
  validatePoints(points);

  const question = await questionRepository.createQuestion(clientId, {
    type,
    text,
    options,
    answer,
    points,
  });

  return question;
};

const updateQuestion = async (
  clientId,
  questionId,
  { type, text, options, answer, points } = {}
) => {
  validateId(questionId);

  const question = await questionRepository.retrieveQuestion(
    clientId,
    questionId
  );

  if (!question) {
    throw new NotExistError("There is no question with this ID.");
  }

  if (type === undefined) type = question.type;
  if (text === undefined) text = question.text;
  if (options === undefined) options = question.options;
  if (answer === undefined) answer = question.answer;
  if (points === undefined) points = question.points;

  validateType(type);
  validateText(text);
  validateOptions(type, options);
  validateAnswer(type, options, answer);
  validatePoints(points);

  return questionRepository.updateQuestion(clientId, questionId, {
    type,
    text,
    options,
    answer,
    points,
  });
};

const deleteQuestion = async (clientId, questionId) => {
  validateId(questionId);

  const question = await questionRepository.deleteQuestion(
    clientId,
    questionId
  );

  if (!question) {
    throw new NotExistError("There is no question with this ID.");
  }

  return question;
};

module.exports = {
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
