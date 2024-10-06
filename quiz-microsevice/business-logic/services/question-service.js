const validator = require("validator");

const { QuestionsTypes } = require("../enums");
const { ValidationError, NotExistError } = require("../errors/common");

const { questionRepository } = require("../../data-access/repositories");

const validateId = (id) => {
  if (!validator.isMongoId(id)) {
    throw new ValidationError("Invalid question id, it must be a MongoId.");
  }
};

const validateType = (type) => {
  if (!Object.values(QuestionsTypes).includes(type)) {
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
    case QuestionsTypes.MILTIPLE_CHOICE: {
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
    case QuestionsTypes.SHORT_ANSWER: {
      if (
        typeof answer !== "string" ||
        !validator.isLength(answer, { min: 1, max: 250 })
      ) {
        throw new ValidationError(
          "Invalid 'answer', it must be a string between 1 and 250 characters for Short-Answer questions."
        );
      }

      break;
    }

    case QuestionsTypes.LONG_ANSWER: {
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

    case QuestionsTypes.MILTIPLE_CHOICE: {
      if (!options.includes(answer)) {
        throw new ValidationError(
          "Invalid 'answer', it must be one of the provided options for Multiple-Choice questions."
        );
      }

      break;
    }

    case QuestionsTypes.TRUE_FALSE: {
      if (typeof answer !== "boolean") {
        throw new ValidationError(
          "Invalid 'answer', it must be a boolean for True/False questions."
        );
      }

      break;
    }

    case QuestionsTypes.FILL_IN_THE_BLANK: {
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

const addQuestionToQuiz = async (
  clientId,
  quizId,
  type = QuestionsTypes.SHORT_ANSWER,
  text,
  options = null,
  answer,
  points = 1
) => {
  validateType(type);
  validateText(text);
  validateOptions(type, options);
  validateAnswer(type, options, answer);
  validatePoints(points);

  const question = await questionRepository.addQuestionToQuiz(
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

const updateQuestionInQuiz = async (
  clientId,
  quizId,
  questionId,
  { type, text, options, answer, points }
) => {
  validateId(questionId);

  const question = await questionRepository.retrieveQuestionFromQuiz(
    clientId,
    quizId,
    questionId
  );

  if (!question) {
    throw new NotExistError("There is no question with this id for this quiz.");
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

  const updatedQuestion = await questionRepository.updateQuestionInQuiz(
    clientId,
    quizId,
    questionId,
    { type, text, options, answer, points }
  );

  return updatedQuestion;
};

const removeQuestionFormQuiz = async (clientId, quizId, questionId) => {
  validateId(questionId);

  const question = await questionRepository.removeQuestionFromQuiz(
    clientId,
    quizId,
    questionId
  );

  if (!question) {
    throw new NotExistError("There is no question with this id for this quiz.");
  }
};

const removeAllQuestionsFormQuiz = async (clientId, quizId) => {
  await questionRepository.removeAllQuestionsFromQuiz(clientId, quizId);
};

const retrieveQuestionFromQuiz = async (clientId, quizId, questionId) => {
  validateId(questionId);

  const question = await questionRepository.retrieveQuestionFromQuiz(
    clientId,
    quizId,
    questionId
  );

  if (!question) {
    throw new NotExistError("There is no question with this id for this quiz.");
  }

  return question;
};

const retrieveAllQuestionsFromQuiz = async (clientId, quizId) => {
  const questions = await questionRepository.retrieveAllQuestionsFromQuiz(
    clientId,
    quizId
  );

  return questions;
};

module.exports = {
  addQuestionToQuiz,
  updateQuestionInQuiz,
  removeQuestionFormQuiz,
  removeAllQuestionsFormQuiz,
  retrieveQuestionFromQuiz,
  retrieveAllQuestionsFromQuiz,
};
