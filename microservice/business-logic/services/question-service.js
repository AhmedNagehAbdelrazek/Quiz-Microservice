const validator = require("validator");

const { QuestionsType } = require("../enums");
const { ValidationError, NotExistError } = require("../errors/common");

const { questionRepository } = require("../../data-access/repositories");

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
  if (
    typeof text !== "string" ||
    !validator.isLength(text, { min: 1, max: 500 })
  ) {
    throw new ValidationError(
      "Invalid 'text', it must be a string between 1 and 500 characters."
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
    case QuestionsType.SHORT_ANSWER: {
      if (
        typeof answer !== "string" ||
        !validator.isLength(answer, { min: 1, max: 200 })
      ) {
        throw new ValidationError(
          "Invalid 'answer', it must be a string between 1 and 200 characters for Short-Answer questions."
        );
      }

      break;
    }

    case QuestionsType.LONG_ANSWER: {
      if (
        typeof answer !== "string" ||
        !validator.isLength(answer, { min: 1, max: 500 })
      ) {
        throw new ValidationError(
          "Invalid 'answer', it must be a string between 1 and 500 characters for Long-Answer questions."
        );
      }

      break;
    }

    case QuestionsType.MILTIPLE_CHOICE: {
      if (!options.includes(answer)) {
        throw new ValidationError(
          "Invalid 'answer', it must be one of the provided options for Multiple-Choice questions."
        );
      }

      break;
    }

    case QuestionsType.TRUE_FALSE: {
      if (typeof answer !== "boolean") {
        throw new ValidationError(
          "Invalid 'answer', it must be a boolean for True/False questions."
        );
      }

      break;
    }

    case QuestionsType.FILL_IN_THE_BLANK: {
      if (
        !Array.isArray(answer) ||
        !answer.every((a) => typeof a === "string")
      ) {
        throw new ValidationError(
          "Invalid 'answer', it must be an array of strings for Fill-In-The-Blank questions."
        );
      }

      break;
    }
  }
};

const validatePoints = (points) => {
  if (!validator.isInt(String(points), { min: 0, max: 100 })) {
    throw new ValidationError(
      "Invalid 'points', it must be a number between 0 and 100."
    );
  }
};

const createQuestion = async (clientId, data) => {
  const {
    type = QuestionsType.SHORT_ANSWER,
    text,
    options = null,
    answer,
    points = 1,
  } = data;

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

const createQuestions = async (clientId, questions) => {
  const createdQuestions = [];

  for (let i = 0; i < questions.length; i++) {
    try {
      const question = await createQuestion(clientId, questions[i]);

      createdQuestions.push(question);
    } catch (error) {
      await Promise.all(
        createdQuestions.map((question) =>
          deleteQuestion(clientId, question.id)
        )
      );

      throw new ValidationError(
        `Failed to create question ${i + 1}: ${error.message}`
      );
    }
  }

  return createdQuestions;
};

const updateQuestion = async (clientId, questionId, data) => {
  let { type, text, options, answer, points } = data;

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
  validateId(id);

  const question = await questionRepository.deleteQuestion(clientId, questionId);

  if (!question) {
    throw new NotExistError("There is no question with this ID.");
  }

  return question;
};

const retrieveQuestion = async (clientId, questionId) => {
  validateId(id);

  const question = await questionRepository.retrieveQuestion(clientId, questionId);

  if (!question) {
    throw new NotExistError("There is no question with this ID.");
  }

  return question;
};

module.exports = {
  createQuestion,
  createQuestions,
  updateQuestion,
  deleteQuestion,
  retrieveQuestion,
};
