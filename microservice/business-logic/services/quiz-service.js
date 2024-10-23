const validator = require("validator");

const { QuizStatus, AttemptStatus } = require("../enums");

const {
  ValidationError,
  NotExistError,
  InvalidStatusError,
} = require("../errors/common");

const { AttemptLimitError, ActiveAttemptError } = require("../errors/attempt");

const questionService = require("../services/question-service");
const { getModels } = require("../../data-access/models");

const {
  quizRepository,
  userRepository,
  attemptRepository,
  questionRepository,
} = require("../../data-access/repositories");

// Constants

const TITLE_LENGTH = { min: 1, max: 200 };
const DESCRIPTION_LENGTH = { min: 1, max: 500 };

// Validations

const validateId = (id, message = "Invalid ID, it must be a UUID.") => {
  if (!validator.isUUID(id)) {
    throw new ValidationError(message);
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

  delete quiz.questions;

  return quiz;
};

const updateQuiz = async (
  clientId,
  quizId,
  { title, description, timeLimit, attemptLimit }
) => {
  validateId(quizId, "Invalid quiz ID, it must be a UUID.");

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

  const updatedQuiz = await quizRepository.updateQuiz(clientId, quizId, {
    title,
    description,
    timeLimit,
    attemptLimit,
  });

  delete updatedQuiz.questions;

  return updatedQuiz;
};

const publishQuiz = async (clientId, quizId) => {
  validateId(quizId, "Invalid quiz ID, it must be a UUID.");

  const quiz = await quizRepository.retrieveQuiz(clientId, quizId);

  if (!quiz) {
    throw new NotExistError("There is no quiz with this ID.");
  }

  if (quiz.status === QuizStatus.PUBLISHED) {
    throw new InvalidStatusError("The quiz has already been published.");
  }

  const updatedQuiz = await quizRepository.updateQuiz(clientId, quizId, {
    status: QuizStatus.PUBLISHED,
  });

  delete updatedQuiz.questions;

  return updatedQuiz;
};

const unpublishQuiz = async (clientId, quizId) => {
  validateId(quizId, "Invalid quiz ID, it must be a UUID.");

  const quiz = await quizRepository.retrieveQuiz(clientId, quizId);

  if (!quiz) {
    throw new NotExistError("There is no quiz with this ID.");
  }

  if (quiz.status === QuizStatus.DRAFTED) {
    throw new InvalidStatusError("This quiz has already been drafted.");
  }

  const updatedQuiz = await quizRepository.updateQuiz(clientId, quizId, {
    status: QuizStatus.DRAFTED,
  });

  delete updatedQuiz.questions;

  return updatedQuiz;
};

const archiveQuiz = async (clientId, quizId) => {
  validateId(quizId, "Invalid quiz ID, it must be a UUID.");

  const quiz = await quizRepository.retrieveQuiz(clientId, quizId);

  if (!quiz) {
    throw new NotExistError("There is no quiz with this ID.");
  }

  if (quiz.status === QuizStatus.ARCHIVED) {
    throw new InvalidStatusError("The quiz has already been archived.");
  }

  const updatedQuiz = await quizRepository.updateQuiz(clientId, quizId, {
    status: QuizStatus.ARCHIVED,
  });

  delete updatedQuiz.questions;

  return updatedQuiz;
};

const unarchieQuiz = async (clientId, quizId) => {
  validateId(quizId, "Invalid quiz ID, it must be a UUID.");

  const quiz = await quizRepository.retrieveQuiz(clientId, quizId);

  if (!quiz) {
    throw new NotExistError("There is no quiz with this ID.");
  }

  if (quiz.status === QuizStatus.DRAFTED) {
    throw new InvalidStatusError("This quiz has already been drafted.");
  }

  const updatedQuiz = await quizRepository.updateQuiz(clientId, quizId, {
    status: QuizStatus.DRAFTED,
  });

  delete updatedQuiz.questions;

  return updatedQuiz;
};

const retrieveQuiz = async (clientId, quizId) => {
  validateId(quizId, "Invalid quiz ID, it must be a UUID.");

  const quiz = await quizRepository.retrieveQuiz(clientId, quizId, {
    fullQuestions: true,
  });

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

  quizzes.forEach((quiz) => {
    delete quiz.questions;
  });

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
  validateId(quizId, "Invalid quiz ID, it must be a UUID.");

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
  validateId(quizId, "Invalid quiz ID, it must be a UUID.");

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
  validateId(quizId, "Invalid quiz ID, it must be a UUID.");

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

const startQuiz = async (clientId, userId, quizId) => {
  validateId(userId, "Invalid user ID, it must be a UUID.");
  validateId(quizId, "Invalid quiz ID, it must be a UUID.");

  const quiz = await quizRepository.retrieveQuiz(clientId, quizId, {
    fullQuestions: true,
  });

  if (!quiz || quiz.status !== QuizStatus.PUBLISHED) {
    throw new NotExistError("There is no quiz with this ID.");
  }

  const user = await userRepository.upsertUser(clientId, userId);

  const attemptsCount = await attemptRepository.countAttempts(
    clientId,
    userId,
    quizId
  );

  if (attemptsCount === quiz.attemptLimit) {
    throw new AttemptLimitError(
      "You have reached the maximum allowed number of attempts for this quiz."
    );
  }

  const activeAttempt = await attemptRepository.retrieveActiveAttempt(
    clientId,
    userId
  );

  if (activeAttempt) {
    throw new ActiveAttemptError(
      "You already have an active attempt in progress."
    );
  }

  const attempt = await attemptRepository.createAttempt(clientId, {
    userId,
    quizId,
    startedAt: new Date(),
    submittedAt: null,
    status: AttemptStatus.STARTED,
    responses: [],
  });

  delete quiz.attemptLimit;
  delete quiz.status;

  quiz.questions.forEach((question) => {
    delete question.answer;
  });

  return {
    id: attempt.id,
    user,
    quiz,
    startedAt: attempt.startedAt,
    submittedAt: attempt.submittedAt,
    status: attempt.status,
  };
};



module.exports = {
  createQuiz,
  updateQuiz,
  publishQuiz,
  unpublishQuiz,
  archiveQuiz,
  unarchieQuiz,
  retrieveQuiz,
  retrieveQuizzes,
  addQuestion,
  updateQuestion,
  removeQuestion,
  startQuiz,
};
