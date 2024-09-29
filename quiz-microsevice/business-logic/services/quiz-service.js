const validator = require("validator");

const { DifficultyTypes } = require("../enums");
const { ValidationError, NotExistError } = require("../errors/common");
const { QuizAlreadyPublishedError } = require("../errors/quiz");
const questionService = require("../services/question-service");

const { quizRepository } = require("../../data-access/repositories");

const validatId = (id, message = "Invalid id. It must be a valid MongoId.") => {
  if (!validator.isMongoId(id)) {
    throw new ValidationError(message);
  }
};

const validatePage = (page) => {
  if (!validator.isInt(String(page), { min: 0 })) {
    throw new ValidationError("Invalid page, It must be a positive integer.");
  }
};

const validateLimit = (limit) => {
  if (!validator.isInt(String(limit), { min: 0 })) {
    throw new ValidationError("Invalid limit, It must be a positive integer.");
  }
};

const validateTitle = (title) => {
  if (typeof title !== "string") {
    throw new ValidationError("Invalid title, It must be a string.");
  }

  if (!validator.isLength(title, { min: 1, max: 128 })) {
    throw new ValidationError(
      "Invalid title, It must be between 1 and 128 characters."
    );
  }
};

const validateDescription = (description) => {
  if (typeof description !== "string") {
    throw new ValidationError(`Invalid description, It must be a string.`);
  }

  if (!validator.isLength(description, { min: 1, max: 1024 })) {
    throw new ValidationError(
      "Invalid description, It must be between 1 and 1024 characters."
    );
  }
};

const validateCategories = (categories) => {
  if (
    !Array.isArray(categories) ||
    !categories.every((category) => typeof category === "string")
  ) {
    throw new ValidationError(
      "Invalid categories, It must be an array of strings."
    );
  }
};

const validateDifficulty = (difficulty) => {
  if (!Object.values(DifficultyTypes).includes(difficulty)) {
    throw new ValidationError("Invalid difficulty.");
  }
};

const validateTimeLimit = (timeLimit) => {
  if (timeLimit !== null && !validator.isInt(String(timeLimit), { min: 0 })) {
    throw new ValidationError(
      "Invalid timeLimit, It must be a positive integer or null."
    );
  }
};

const validateAttemptLimit = (attemptLimit) => {
  if (
    attemptLimit !== null &&
    !validator.isInt(String(attemptLimit), { min: 0 })
  ) {
    throw new ValidationError(
      "Invalid attemptLimit, It must be a positive integer or null."
    );
  }
};

const validateDueDate = (dueDate) => {
  if (
    dueDate !== null &&
    (typeof dueDate !== "string" || !validator.isISO8601(dueDate))
  ) {
    throw new ValidationError(
      "Invalid dueDate, it must be a valid ISO 8601 date string or null."
    );
  }
};

const validatePassingScore = (passingScore) => {
  if (!validator.isInt(String(passingScore), { min: 0, max: 100 })) {
    throw new ValidationError(
      `Invalid passingScore, It must be between 0 and 100.`
    );
  }
};

const validateQuestions = (questions) => {
  if (!Array.isArray(questions)) {
    throw new ValidationError("Invalid questions, It must be an array.");
  }
};

const createQuiz = async (
  clientId,
  title,
  description,
  categories,
  difficulty,
  timeLimit,
  attemptLimit,
  dueDate,
  passingScore,
  questions
) => {
  validatId(clientId, "Invalid clientId, It must be a valid MongoId.");
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
    passingScore
  );

  const createdQuestions = [];

  for (let i = 0; i < questions.length; i++) {
    const { type, text, options, answer, points } = questions[i];

    try {
      const createdQuestion = await questionService.createQuestion(
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
      await deleteQuizWithQuestions(clientId, quiz.id);

      throw new ValidationError(
        `Failed to create question ${i + 1}: ${error.message}`
      );
    }
  }

  const questionsWithoutQuizId = createdQuestions.map(
    ({ quizId, ...rest }) => rest
  );

  return { ...quiz, questions: questionsWithoutQuizId };
};

const retrieveQuizzes = async (clientId, page, limit) => {
  validatId(clientId, "Invalid clientId, It must be a valid MongoId.");
  validatePage(page);
  validateLimit(limit);

  const quizzes = await quizRepository.retrieveQuizzes(
    clientId,
    (page - 1) * limit,
    limit
  );

  const totalCount = await quizRepository.countQuizzes(clientId);
  const totalPages = Math.ceil(totalCount / limit);

  return {
    quizzes,
    pagination: {
      page,
      totalPages,
    },
  };
};

const retrieveQuiz = async (clientId, quizId) => {
  validatId(clientId, "Invalid clientId, It must be a valid MongoId.");
  validatId(quizId, "Invalid quizId, It must be a valid MongoId.");

  const quiz = await quizRepository.retrieveQuiz(clientId, quizId);

  if (!quiz) {
    throw new NotExistError("There is no quiz with this id.");
  }

  const questions = await questionService.retrieveQuestionsForQuiz(
    clientId,
    quizId
  );

  return { ...quiz, questions };
};

const publishQuiz = async (clientId, quizId) => {
  validatId(clientId, "Invalid clientId, It must be a valid MongoId.");
  validatId(quizId, "Invalid quizId, It must be a valid MongoId.");

  let quiz = await quizRepository.retrieveQuiz(clientId, quizId);

  if (!quiz) {
    throw new NotExistError("There is no quiz with this id.");
  }

  if (quiz.isPublished) {
    throw new QuizAlreadyPublishedError();
  }

  quiz = await quizRepository.updateQuiz(clientId, quizId, {
    isPublished: true,
  });

  return quiz;
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
  validatId(clientId, "Invalid clientId, It must be a valid MongoId.");
  validatId(quizId, "Invalid quizId, It must be a valid MongoId.");

  const quiz = await quizRepository.retrieveQuiz(clientId, quizId);

  if (!quiz) {
    throw new NotExistError("There is no quiz with this id.");
  }

  const question = await questionService.createQuestion(
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

const deleteQuizWithQuestions = async (clientId, quizId) => {
  validatId(clientId, "Invalid clientId, It must be a valid MongoId.");
  validatId(quizId, "Invalid quizId, It must be a valid MongoId.");

  await quizRepository.deleteQuiz(clientId, quizId);
  await questionService.deleteQuestionsForQuiz(clientId, quizId);
};

module.exports = {
  createQuiz,
  retrieveQuizzes,
  retrieveQuiz,
  publishQuiz,
  addQuestionToQuiz,
};
