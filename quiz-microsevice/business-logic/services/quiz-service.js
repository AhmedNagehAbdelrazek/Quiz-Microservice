const validator = require("validator");

const { DifficultyTypes, QuizStatusTypes } = require("../enums");
const { ValidationError, NotExistError } = require("../errors/common");
const { InvalidQuizStatusError } = require("../errors/quiz");
const questionService = require("../services/question-service");

const { quizRepository } = require("../../data-access/repositories");

const validateId = (id) => {
  if (!validator.isMongoId(id)) {
    throw new ValidationError("Invalid client id, it must be a MongoId.");
  }
};

const validateTitle = (title) => {
  if (
    typeof title !== "string" ||
    !validator.isLength(title, { min: 1, max: 250 })
  ) {
    throw new ValidationError(
      "Invalid 'title', it must be a string between 1 and 250 characters."
    );
  }
};

const validateDescription = (description) => {
  if (
    typeof description !== "string" ||
    !validator.isLength(description, { min: 1, max: 1000 })
  ) {
    throw new ValidationError(
      "Invalid 'description', it must be between 1 and 1000 characters."
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
  if (!Object.values(DifficultyTypes).includes(difficulty)) {
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
  if (!validator.isInt(String(passingScore), { min: 0, max: 100 })) {
    throw new ValidationError(
      `Invalid 'passingScore', it must be between 0 and 100.`
    );
  }
};

const validateQuestions = (questions) => {
  if (!Array.isArray(questions)) {
    throw new ValidationError("Invalid 'questions', it must be an array.");
  }
};

const validatePage = (page) => {
  if (!validator.isInt(String(page), { min: 0 })) {
    throw new ValidationError("Invalid 'page', it must be a positive integer.");
  }
};

const validateLimit = (limit) => {
  if (!validator.isInt(String(limit), { min: 0 })) {
    throw new ValidationError(
      "Invalid 'limit', it must be a positive integer."
    );
  }
};

const validateStatus = (status) => {
  if (!Object.values(QuizStatusTypes).includes(status)) {
    throw new ValidationError("Invalid 'status'.");
  }
};

const createQuiz = async (
  clientId,
  title,
  description,
  categories = [],
  difficulty = DifficultyTypes.EASY,
  timeLimit = null,
  attemptLimit = null,
  dueDate = null,
  passingScore = 50,
  questions = []
) => {
  validateTitle(title);
  validateDescription(description);
  validateCategories(categories);
  validateDifficulty(difficulty);
  validateTimeLimit(timeLimit);
  validateAttemptLimit(attemptLimit);
  validateDueDate(dueDate);
  validatePassingScore(passingScore);
  validateQuestions(questions);

  const quiz = await quizRepository.createQuiz(
    clientId,
    title,
    description,
    categories,
    difficulty,
    timeLimit,
    attemptLimit,
    dueDate,
    passingScore,
    QuizStatusTypes.DRAFTED
  );

  const createdQuestions = [];

  for (let i = 0; i < questions.length; i++) {
    const { type, text, options, answer, points } = questions[i];

    try {
      const createdQuestion = await questionService.addQuestionToQuiz(
        clientId,
        quiz.id,
        type,
        text,
        options,
        answer,
        points
      );

      createdQuestions.push(createdQuestion);
    } catch (error) {
      await questionService.removeAllQuestionsFormQuiz(clientId, quiz.id);
      await quizRepository.deleteQuiz(clientId, quiz.id);

      throw new ValidationError(
        `Failed to create question ${i + 1}: ${error.message}`
      );
    }
  }

  return { ...quiz, questions: createdQuestions };
};

const updateQuiz = async (
  clientId,
  quizId,
  {
    title,
    description,
    categories,
    difficulty,
    timeLimit,
    attemptLimit,
    dueDate,
    passingScore,
  }
) => {
  validateId(quizId);

  const quiz = await quizRepository.retrieveQuiz(clientId, quizId);

  if (!quiz) {
    throw new NotExistError("There is no quiz with this id.");
  }

  if (quiz.status !== QuizStatusTypes.DRAFTED) {
    throw new InvalidQuizStatusError(
      "The quiz is not in draft mode cannot be updated."
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

  let quiz = await quizRepository.retrieveQuiz(clientId, quizId);

  if (!quiz) {
    throw new NotExistError("There is no quiz with this id.");
  }

  if (quiz.status === QuizStatusTypes.PUBLISHED) {
    throw new InvalidQuizStatusError(
      "The quiz is already published and cannot be published again."
    );
  }

  quiz = await quizRepository.updateQuiz(clientId, quizId, {
    status: QuizStatusTypes.PUBLISHED,
  });

  return quiz;
};

const unpublishQuiz = async (clientId, quizId) => {
  validateId(quizId);

  let quiz = await quizRepository.retrieveQuiz(clientId, quizId);

  if (!quiz) {
    throw new NotExistError("There is no quiz with this id.");
  }

  if (quiz.status === QuizStatusTypes.DRAFTED) {
    throw new InvalidQuizStatusError("The quiz is already in draft mode.");
  }

  quiz = await quizRepository.updateQuiz(clientId, quizId, {
    status: QuizStatusTypes.DRAFTED,
  });

  return quiz;
};

const archiveQuiz = async (clientId, quizId) => {
  validateId(quizId);

  let quiz = await quizRepository.retrieveQuiz(clientId, quizId);

  if (!quiz) {
    throw new NotExistError("There is no quiz with this id.");
  }

  if (quiz.status === QuizStatusTypes.ARCHIVED) {
    throw new InvalidQuizStatusError(
      "The quiz is already archived and cannot be archived again."
    );
  }

  quiz = await quizRepository.updateQuiz(clientId, quizId, {
    status: QuizStatusTypes.ARCHIVED,
  });

  return quiz;
};

const unarchieQuiz = async (clientId, quizId) => {
  validateId(quizId);

  let quiz = await quizRepository.retrieveQuiz(clientId, quizId);

  if (!quiz) {
    throw new NotExistError("There is no quiz with this id.");
  }

  if (quiz.status === QuizStatusTypes.DRAFTED) {
    throw new InvalidQuizStatusError("The quiz is already in draft mode.");
  }

  quiz = await quizRepository.updateQuiz(clientId, quizId, {
    status: QuizStatusTypes.DRAFTED,
  });

  return quiz;
};

const deleteQuiz = async (clientId, quizId) => {
  validateId(quizId);

  let quiz = await quizRepository.retrieveQuiz(clientId, quizId);

  if (!quiz) {
    throw new NotExistError("There is no quiz with this id.");
  }

  if (quiz.status === QuizStatusTypes.DELETED) {
    throw new InvalidQuizStatusError(
      "The quiz is already deleted and cannot be deleted again."
    );
  }

  quiz = await quizRepository.updateQuiz(clientId, quizId, {
    status: QuizStatusTypes.DELETED,
  });

  return quiz;
};

const restoreQuiz = async (clientId, quizId) => {
  validateId(quizId);

  let quiz = await quizRepository.retrieveQuiz(clientId, quizId);

  if (!quiz) {
    throw new NotExistError("There is no quiz with this id.");
  }

  if (quiz.status === QuizStatusTypes.DRAFTED) {
    throw new InvalidQuizStatusError("The quiz is already in draft mode.");
  }

  quiz = await quizRepository.updateQuiz(clientId, quizId, {
    status: QuizStatusTypes.DRAFTED,
  });

  return quiz;
};

const permanentlyDeleteQuiz = async (clientId, quizId) => {
  validateId(quizId);

  let quiz = await quizRepository.retrieveQuiz(clientId, quizId);

  if (!quiz) {
    throw new NotExistError("There is no quiz with this id.");
  }

  if (quiz.status !== QuizStatusTypes.DELETED) {
    throw new InvalidQuizStatusError(
      "The quiz must be deleted before it can be permanently deleted."
    );
  }

  await quizRepository.deleteQuiz(clientId, quizId);
};

const retrieveQuiz = async (clientId, quizId) => {
  validateId(quizId);

  const quiz = await quizRepository.retrieveQuiz(clientId, quizId);

  if (!quiz) {
    throw new NotExistError("There is no quiz with this id.");
  }

  const questions = await questionService.retrieveAllQuestionsFromQuiz(
    clientId,
    quizId
  );

  return { ...quiz, questions };
};

const retrieveQuizzes = async (
  clientId,
  page = 1,
  limit = 20,
  status = QuizStatusTypes.PUBLISHED
) => {
  validatePage(page);
  validateLimit(limit);
  validateStatus(status);

  const quizzes = await quizRepository.retrieveQuizzes(
    clientId,
    (page - 1) * limit,
    limit,
    status
  );

  const totalCount = await quizRepository.countQuizzes(clientId, status);
  const totalPages = Math.ceil(totalCount / limit);

  return {
    quizzes,
    pagination: {
      page,
      totalPages,
    },
  };
};

const addQuestionToQuiz = async (
  clientId,
  quizId,
  type,
  text,
  options,
  answer,
  points
) => {
  validateId(quizId);

  const quiz = await quizRepository.retrieveQuiz(clientId, quizId);

  if (!quiz) {
    throw new NotExistError("There is no quiz with this id.");
  }

  return questionService.addQuestionToQuiz(
    clientId,
    quizId,
    type,
    text,
    options,
    answer,
    points
  );
};

const updateQuestionInQuiz = async (
  clientId,
  quizId,
  questionId,
  { type, text, options, answer, points }
) => {
  validateId(quizId);

  const quiz = await quizRepository.retrieveQuiz(clientId, quizId);

  if (!quiz) {
    throw new NotExistError("There is no quiz with this id.");
  }

  return questionService.updateQuestionInQuiz(clientId, quizId, questionId, {
    type,
    text,
    options,
    answer,
    points,
  });
};

const removeQuestionFromQuiz = async (clientId, quizId, questionId) => {
  validateId(quizId);

  const quiz = await quizRepository.retrieveQuiz(clientId, quizId);

  if (!quiz) {
    throw new NotExistError("There is no quiz with this id.");
  }

  await questionService.removeQuestionFormQuiz(clientId, quizId, questionId);
};

module.exports = {
  createQuiz,
  updateQuiz,
  publishQuiz,
  unpublishQuiz,
  archiveQuiz,
  unarchieQuiz,
  deleteQuiz,
  restoreQuiz,
  permanentlyDeleteQuiz,
  retrieveQuiz,
  retrieveQuizzes,
  addQuestionToQuiz,
  updateQuestionInQuiz,
  removeQuestionFromQuiz,
};
