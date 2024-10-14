const validator = require("validator");

const { QuizStatus } = require("../enums");

const {
  ValidationError,
  NotExistError,
  InvalidStatusError,
} = require("../errors/common");

const questionService = require("../services/question-service");

const { quizRepository } = require("../../data-access/repositories");

// Constants

const TITLE_LENGTH = { min: 1, max: 200 };
const DESCRIPTION_LENGTH = { min: 1, max: 500 };

// Validations

const validateId = (id) => {
  if (!validator.isUUID(id)) {
    throw new ValidationError("Invalid quiz ID, it must be a UUID.");
  }
};

const validateTitle = (title) => {
  if (typeof title !== "string" || !validator.isLength(title, TITLE_LENGTH)) {
    throw new ValidationError(
      `Invalid 'title', it must be a string between ${TITLE_LENGTH.min} and ${TITLE_LENGTH.max} characters.`
    );
  }
};

const validateDescription = (description) => {
  if (
    typeof description !== "string" ||
    !validator.isLength(description, DESCRIPTION_LENGTH)
  ) {
    throw new ValidationError(
      `Invalid 'description', it must be a string between ${DESCRIPTION_LENGTH.min} and ${DESCRIPTION_LENGTH.max} characters.`
    );
  }
};

const validateTimeLimit = (timeLimit) => {
  if (timeLimit !== null && !validator.isInt(String(timeLimit), { min: 60 })) {
    throw new ValidationError(
      "Invalid 'timeLimit', it must be an integer greater than 60 or null"
    );
  }
};

const validateAttemptLimit = (attemptLimit) => {
  if (
    attemptLimit !== null &&
    !validator.isInt(String(attemptLimit), { min: 1 })
  ) {
    throw new ValidationError(
      "Invalid 'attemptLimit', it must be an integer greater than 1 or null"
    );
  }
};

const validatePage = (page) => {
  if (!validator.isInt(String(page), { min: 1 })) {
    throw new ValidationError(
      "Invalid 'page', it must be an integer greater than 1"
    );
  }
};

const validateLimit = (limit) => {
  if (!validator.isInt(String(limit), { min: 1 })) {
    throw new ValidationError(
      "Invalid 'limit', it must be an integer greater than 1"
    );
  }
};

const validateStatus = (status) => {
  if (!Object.values(QuizStatus).includes(status)) {
    throw new ValidationError("Invalid 'status'.");
  }
};

// Use Cases

const createQuiz = async (
  clientId,
  { title, description, timeLimit, attemptLimit } = {}
) => {
  validateTitle(title);
  validateDescription(description);
  validateTimeLimit(timeLimit);
  validateAttemptLimit(attemptLimit);

  const quiz = await quizRepository.createQuiz(clientId, {
    title,
    description,
    timeLimit,
    attemptLimit,
    status: QuizStatus.DRAFTED,
    questions: [],
  });

  return quiz;
};

const updateQuiz = async (
  clientId,
  quizId,
  { title, description, timeLimit, attemptLimit }
) => {
  validateId(quizId);

  const quiz = await quizRepository.retrieveQuiz(clientId, quizId);

  if (!quiz) {
    throw new NotExistError("There is no quiz with this ID.");
  }

  if (quiz.status !== QuizStatus.DRAFTED) {
    throw new InvalidStatusError(
      "This quiz is not drafted and cannot be updated."
    );
  }

  if (title === undefined) title = quiz.title;
  if (description === undefined) description = quiz.description;
  if (timeLimit === undefined) timeLimit = quiz.timeLimit;
  if (attemptLimit === undefined) attemptLimit = quiz.attemptLimit;

  validateTitle(title);
  validateDescription(description);
  validateTimeLimit(timeLimit);
  validateAttemptLimit(attemptLimit);

  return quizRepository.updateQuiz(clientId, quizId, {
    title,
    description,
    timeLimit,
    attemptLimit,
  });
};

const publishQuiz = async (clientId, quizId) => {
  validateId(quizId);

  const quiz = await quizRepository.retrieveQuiz(clientId, quizId);

  if (!quiz) {
    throw new NotExistError("There is no quiz with this ID.");
  }

  if (quiz.status === QuizStatus.PUBLISHED) {
    throw new InvalidStatusError("The quiz has already been published.");
  }

  return quizRepository.updateQuiz(clientId, quizId, {
    status: QuizStatus.PUBLISHED,
  });
};

const unpublishQuiz = async (clientId, quizId) => {
  validateId(quizId);

  const quiz = await quizRepository.retrieveQuiz(clientId, quizId);

  if (!quiz) {
    throw new NotExistError("There is no quiz with this ID.");
  }

  if (quiz.status === QuizStatus.DRAFTED) {
    throw new InvalidStatusError("This quiz has already been drafted.");
  }

  return quizRepository.updateQuiz(clientId, quizId, {
    status: QuizStatus.DRAFTED,
  });
};

const archiveQuiz = async (clientId, quizId) => {
  validateId(quizId);

  const quiz = await quizRepository.retrieveQuiz(clientId, quizId);

  if (!quiz) {
    throw new NotExistError("There is no quiz with this ID.");
  }

  if (quiz.status === QuizStatus.ARCHIVED) {
    throw new InvalidStatusError("The quiz has already been archived.");
  }

  return quizRepository.updateQuiz(clientId, quizId, {
    status: QuizStatus.ARCHIVED,
  });
};

const unarchieQuiz = async (clientId, quizId) => {
  validateId(quizId);

  const quiz = await quizRepository.retrieveQuiz(clientId, quizId);

  if (!quiz) {
    throw new NotExistError("There is no quiz with this ID.");
  }

  if (quiz.status === QuizStatus.DRAFTED) {
    throw new InvalidStatusError("This quiz has already been drafted.");
  }

  return quizRepository.updateQuiz(clientId, quizId, {
    status: QuizStatus.DRAFTED,
  });
};

const deleteQuiz = async (clientId, quizId) => {
  validateId(quizId);

  const quiz = await quizRepository.deleteQuiz(clientId, quizId);

  if (!quiz) {
    throw new NotExistError("There is no quiz with this ID.");
  }

  await Promise.all(
    quiz.questions.map((questionId) =>
      questionService.deleteQuestion(clientId, questionId)
    )
  );

  return quiz;
};

const retrieveQuiz = async (clientId, quizId) => {
  validateId(quizId);

  const quiz = await quizRepository.retrieveQuiz(clientId, quizId);

  if (!quiz) {
    throw new NotExistError("There is no quiz with this ID.");
  }

  return quiz;
};

const retrieveQuizzes = async (
  clientId,
  { status = QuizStatus.PUBLISHED } = {},
  { page = 1, limit = 20 } = {}
) => {
  validateStatus(status);
  validatePage(page);
  validateLimit(limit);

  page = Number(page);
  limit = Number(limit);

  const quizzes = await quizRepository.retrieveQuizzes(
    clientId,
    { status },
    {
      skip: (page - 1) * limit,
      limit,
    }
  );

  const totalCount = await quizRepository.countQuizzes(clientId, { status });

  const totalPages = Math.ceil(totalCount / limit);

  return {
    quizzes,
    pagination: {
      page,
      totalPages,
    },
  };
};

const addQuestion = async (
  clientId,
  quizId,
  { type, text, options, answer, points }
) => {
  validateId(quizId);

  const quiz = await quizRepository.retrieveQuiz(clientId, quizId);

  if (!quiz) {
    throw new NotExistError("There is no quiz with this ID.");
  }

  if (quiz.status !== QuizStatus.DRAFTED) {
    throw new InvalidStatusError(
      "This quiz is not drafted and cannot be updated."
    );
  }

  const questions = quiz.questions;
  const question = await questionService.createQuestion(clientId, {
    type,
    text,
    options,
    answer,
    points,
  });

  questions.push(question.id);

  await quizRepository.updateQuiz(clientId, quizId, { questions });

  return question;
};

const updateQuestion = async (
  clientId,
  quizId,
  questionId,
  { type, text, options, answer, points }
) => {
  validateId(quizId);

  const quiz = await quizRepository.retrieveQuiz(clientId, quizId);

  if (!quiz) {
    throw new NotExistError("There is no quiz with this ID.");
  }

  if (quiz.status !== QuizStatus.DRAFTED) {
    throw new InvalidStatusError(
      "This quiz is not drafted and cannot be updated."
    );
  }

  const questions = quiz.questions;
  const index = questions.findIndex((question) => question === questionId);

  if (index === -1) {
    throw new NotExistError("There is no question with this ID for this quiz.");
  }

  return questionService.updateQuestion(clientId, questionId, {
    type,
    text,
    options,
    answer,
    points,
  });
};

const removeQuestion = async (clientId, quizId, questionId) => {
  validateId(quizId);

  const quiz = await quizRepository.retrieveQuiz(clientId, quizId);

  if (!quiz) {
    throw new NotExistError("There is no quiz with this ID.");
  }

  if (quiz.status !== QuizStatus.DRAFTED) {
    throw new InvalidStatusError(
      "This quiz is not drafted and cannot be updated."
    );
  }

  const questions = quiz.questions;
  const index = questions.findIndex((question) => question === questionId);

  if (index === -1) {
    throw new NotExistError("There is no question with this ID for this quiz.");
  }

  questions.splice(index, 1)[0];

  const question = await questionService.deleteQuestion(clientId, questionId);

  await quizRepository.updateQuiz(clientId, quizId, { questions });

  return question;
};

module.exports = {
  createQuiz,
  updateQuiz,
  publishQuiz,
  unpublishQuiz,
  archiveQuiz,
  unarchieQuiz,
  deleteQuiz,
  retrieveQuiz,
  retrieveQuizzes,
  addQuestion,
  updateQuestion,
  removeQuestion,
};
