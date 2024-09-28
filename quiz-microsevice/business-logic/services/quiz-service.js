const validator = require("validator");

const { DifficultyTypes } = require("../enums");
const { ValidationError } = require("../errors/common");
const questionService = require("../services/question-service");

const { quizRepository } = require("../../data-access/repositories");

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

const retrieveQuizzes = async (clientId) => {
  const { quizzes, questions } = await quizRepository.retrieveQuizzes(clientId);

  if (!Array.isArray(quizzes)) {
    throw new Error("Quizzes is not an array");
  }

  const quizzesWithQuestions = quizzes.map((quiz) => {
    const quizData = quiz;
    return {
      _id: quizData._id,
      title: quizData.title,
      description: quizData.description,
      categories: quizData.categories,
      difficulty: quizData.difficulty,
      timeLimit: quizData.timeLimit,
      attemptLimit: quizData.attemptLimit,
      dueDate: quizData.dueDate,
      passingScore: quizData.passingScore,
      isPublished: quizData.isPublished,
      createdAt: quizData.createdAt,
      updatedAt: quizData.updatedAt,
      questions: questions,
    };
  });

  return {
    success: true,
    quizzes: quizzesWithQuestions,
  };
};

module.exports = { createQuiz, retrieveQuizzes };

const deleteQuizWithQuestions = async (clientId, quizId) => {
  await quizRepository.deleteQuiz(clientId, quizId);
  await questionService.deleteQuestionsForQuiz(clientId, quizId);
};

module.exports = { createQuiz };
