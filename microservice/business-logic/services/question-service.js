const validator = require("validator");

const { QuestionsType, QuestionStatus, DeleteType } = require("../enums");
const {
  ValidationError,
  NotExistError,
  InvalidStatusError,
} = require("../errors/common");

const { questionRepository } = require("../../data-access/repositories");

const validateId = (id) => {
  if (!validator.isUUID(id)) {
    throw new ValidationError("Invalid question id, it must be a UUID.");
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
        !validator.isLength(answer, { min: 1, max: 250 })
      ) {
        throw new ValidationError(
          "Invalid 'answer', it must be a string between 1 and 250 characters for Short-Answer questions."
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

const createQuizQuestion = async (
  clientId,
  quizId,
  type = QuestionsType.SHORT_ANSWER,
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

  const question = await questionRepository.createQuizQuestion(
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

const updateQuizQuestion = async (
  clientId,
  quizId,
  questionId,
  { type, text, options, answer, points }
) => {
  validateId(questionId);

  const question = await questionRepository.retrieveQuizQuestion(
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

  return questionRepository.updateQuizQuestion(clientId, quizId, questionId, {
    type,
    text,
    options,
    answer,
    points,
  });
};

const deleteQuizQuestion = async (
  clientId,
  quizId,
  questionId,
  type = DeleteType.SOFT
) => {
  validateId(questionId);

  const question = await questionRepository.retrieveQuizQuestion(
    clientId,
    quizId,
    questionId
  );

  if (!question) {
    throw new NotExistError("There is no question with this id.");
  }

  if (type === DeleteType.SOFT) {
    if (question.status === QuestionStatus.DELETED) {
      throw new InvalidStatusError("This question is already deleted.");
    }

    return questionRepository.updateQuizQuestion(clientId, quizId, questionId, {
      status: QuestionStatus.DELETED,
    });
  }

  if (type === DeleteType.HARD) {
    return questionRepository.deleteQuizQuestion(clientId, quizId, questionId);
  }
};

const restoreQuizQuestion = async (clientId, quizId, questionId) => {
  validateId(questionId);

  const question = await questionRepository.updateQuizQuestion(
    clientId,
    quizId,
    questionId
  );

  if (!question) {
    throw new NotExistError("There is no question with this id.");
  }

  if (question.status === QuestionStatus.ACTIVE) {
    throw new InvalidStatusError("This question is already active.");
  }

  return questionRepository.updateQuizQuestion(clientId, quizId, questionId, {
    status: QuestionStatus.ACTIVE,
  });
};

const permanentlyDeleteQuizQuestions = async (clientId, quizId) => {
  await questionRepository.deleteQuizQuestions(clientId, quizId);
};

const retrieveQuizQuestion = async (clientId, quizId, questionId) => {
  validateId(questionId);

  const question = await questionRepository.retrieveQuizQuestion(
    clientId,
    quizId,
    questionId
  );

  if (!question) {
    throw new NotExistError("There is no question with this id for this quiz.");
  }

  return question;
};

const retrieveQuizQuestions = async (
  clientId,
  quizId,
  status = QuestionStatus.ACTIVE
) => {
  return questionRepository.retrieveQuizQuestions(
    clientId,
    quizId,
    status
  );
};

module.exports = {
  createQuizQuestion,
  updateQuizQuestion,
  deleteQuizQuestion,
  restoreQuizQuestion,
  permanentlyDeleteQuizQuestions,
  retrieveQuizQuestion,
  retrieveQuizQuestions,
};
