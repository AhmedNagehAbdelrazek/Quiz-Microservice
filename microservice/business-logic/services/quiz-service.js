const validator = require("validator");

const { QuizStatus, QuizDifficulty } = require("../enums");
const {
  ValidationError,
  NotExistError,
  InvalidStatusError,
} = require("../errors/common");
const questionService = require("../services/question-service");

const { quizRepository } = require("../../data-access/repositories");

const validateId = (id) => {
  if (!validator.isUUID(id)) {
    throw new ValidationError("Invalid quiz ID, it must be a UUID.");
  }
};

const validateTitle = (title) => {
  if (
    typeof title !== "string" ||
    !validator.isLength(title, { min: 1, max: 200 })
  ) {
    throw new ValidationError(
      "Invalid 'title', it must be a string between 1 and 200 characters."
    );
  }
};

const validateDescription = (description) => {
  if (
    typeof description !== "string" ||
    !validator.isLength(description, { min: 1, max: 500 })
  ) {
    throw new ValidationError(
      "Invalid 'description', it must be a string between 1 and 500 characters."
    );
  }
};

const validateCategories = (categories) => {
  if (
    !Array.isArray(categories) ||
    !categories.every((category) => typeof category === "string")
  ) {
    throw new ValidationError(
      "Invalid 'categories', it must be an array of strings."
    );
  }
};

const validateDifficulty = (difficulty) => {
  if (!Object.values(QuizDifficulty).includes(difficulty)) {
    throw new ValidationError("Invalid 'difficulty'.");
  }
};

const validateTimeLimit = (timeLimit) => {
  if (timeLimit !== null && !validator.isInt(String(timeLimit), { min: 0 })) {
    throw new ValidationError(
      "Invalid 'timeLimit', it must be a positive integer or null."
    );
  }
};

const validateAttemptLimit = (attemptLimit) => {
  if (
    attemptLimit !== null &&
    !validator.isInt(String(attemptLimit), { min: 0 })
  ) {
    throw new ValidationError(
      "Invalid 'attemptLimit', it must be a positive integer or null."
    );
  }
};

const validateDueDate = (dueDate) => {
  if (
    dueDate !== null &&
    (typeof dueDate !== "string" || !validator.isISO8601(dueDate))
  ) {
    throw new ValidationError(
      "Invalid 'dueDate', it must be an ISO 8601 date string or null."
    );
  }
};

const validatePassingScore = (passingScore) => {
  if (!validator.isInt(String(passingScore), { min: 0 })) {
    throw new ValidationError(
      `Invalid 'passingScore', it must be a positive integer.`
    );
  }
};

const validateQuestions = (questions) => {
  if (!Array.isArray(questions)) {
    throw new ValidationError("Invalid 'questions', it must be an array.");
  }
};

const validatePage = (page) => {
  if (!validator.isInt(String(page), { min: 1 })) {
    throw new ValidationError(
      "Invalid 'page', it must be an integer greater than one"
    );
  }
};

const validateLimit = (limit) => {
  if (!validator.isInt(String(limit), { min: 1 })) {
    throw new ValidationError(
      "Invalid 'limit', it must be an integer greater than one"
    );
  }
};

const validateStatus = (status) => {
  if (!Object.values(QuizStatus).includes(status)) {
    throw new ValidationError("Invalid 'status'.");
  }
};

const createQuiz = async (clientId, data) => {
  const {
    title,
    description,
    categories = [],
    difficulty = QuizDifficulty.EASY,
    timeLimit = null,
    attemptLimit = null,
    dueDate = null,
    passingScore = 0,
    questions = [],
  } = data;

  validateTitle(title);
  validateDescription(description);
  validateCategories(categories);
  validateDifficulty(difficulty);
  validateTimeLimit(timeLimit);
  validateAttemptLimit(attemptLimit);
  validateDueDate(dueDate);
  validatePassingScore(passingScore);
  validateQuestions(questions);

  const createdQuestions = await questionService.createQuestions(
    clientId,
    questions
  );

  const quiz = await quizRepository.createQuiz(clientId, {
    title,
    description,
    categories,
    difficulty,
    timeLimit,
    attemptLimit,
    dueDate,
    passingScore,
    status: QuizStatus.DRAFTED,
    questions: createdQuestions.map((question) => question.id),
  });

  return quiz;
};

const updateQuiz = async (clientId, quizId, data) => {
  let {
    title,
    description,
    categories,
    difficulty,
    timeLimit,
    attemptLimit,
    dueDate,
    passingScore,
  } = data;

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
  if (categories === undefined) categories = quiz.categories;
  if (difficulty === undefined) difficulty = quiz.difficulty;
  if (timeLimit === undefined) timeLimit = quiz.timeLimit;
  if (attemptLimit === undefined) attemptLimit = quiz.attemptLimit;
  if (dueDate === undefined) dueDate = quiz.dueDate;
  if (passingScore === undefined) passingScore = quiz.passingScore;

  validateTitle(title);
  validateDescription(description);
  validateCategories(categories);
  validateDifficulty(difficulty);
  validateTimeLimit(timeLimit);
  validateAttemptLimit(attemptLimit);
  validateDueDate(dueDate);
  validatePassingScore(passingScore);

  return quizRepository.updateQuiz(clientId, quizId, {
    title,
    description,
    categories,
    difficulty,
    timeLimit,
    attemptLimit,
    dueDate,
    passingScore,
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

  console.log(quiz);

  await Promise.all(
    quiz.questions.map((q) => questionService.deleteQuestion(clientId, q.id))
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

const retrieveQuizzes = async (clientId, filter, pagination) => {
  const { status = QuizStatus.PUBLISHED } = filter;
  let { page = 1, limit = 20 } = pagination;

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

const createQuestion = async (clientId, quizId, data) => {
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

  const question = await questionService.createQuestion(clientId, data);

  quiz.questions.push(question);

  await quizRepository.updateQuiz(clientId, quizId, {
    questions: quiz.questions.map((q) => q.id),
  });

  return question;
};

const updateQuestion = async (clientId, quizId, questionId, data) => {
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

  const index = quiz.questions.findIndex((q) => q.id === questionId);

  if (index === -1) {
    throw new NotExistError("There is no question with this ID for this quiz.");
  }

  return questionService.updateQuestion(clientId, questionId, data);
};

const deleteQuestion = async (clientId, quizId, questionId) => {
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

  const index = quiz.questions.findIndex((q) => q.id === questionId);

  if (index === -1) {
    throw new NotExistError("There is no question with this ID for this quiz.");
  }

  const question = quiz.questions.splice(index, 1)[0];

  await questionService.deleteQuestion(clientId, questionId);

  await quizRepository.updateQuiz(clientId, quizId, {
    questions: quiz.questions.map((q) => q.id),
  });

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
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
