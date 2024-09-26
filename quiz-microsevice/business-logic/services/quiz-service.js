const validator = require("validator");

const { DifficultyTypes } = require("../enums");
const { ValidationError } = require("../errors/common");
const { quizRepository } = require("../../data-access/repositories");
const questionService = require("../services/question-service");

const MIN_TITLE_LENGTH = 1;
const MAX_TITLE_LENGTH = 100;
const MIN_DESCRIPTION_LENGTH = 1;
const MAX_DESCRIPTION_LENGTH = 500;
const MAX_PASSING_SCORE = 100;

const validateTitle = (title) => {
  if (typeof title !== "string") {
    throw new ValidationError(`Invalid title, It must be a string.`);
  }

  if (
    !validator.isLength(title.trim(), {
      min: MIN_TITLE_LENGTH,
      max: MAX_TITLE_LENGTH,
    })
  ) {
    throw new ValidationError(
      `Invalid title, It must be between ${MIN_TITLE_LENGTH} and ${MAX_TITLE_LENGTH} characters.`
    );
  }
};

const validateDescription = (description) => {
  if (typeof description !== "string") {
    throw new ValidationError(`Invalid description, It must be a string.`);
  }

  if (
    !validator.isLength(description.trim(), {
      min: MIN_DESCRIPTION_LENGTH,
      max: MAX_DESCRIPTION_LENGTH,
    })
  ) {
    throw new ValidationError(
      `Invalid description, It must be between ${MIN_DESCRIPTION_LENGTH} and ${MAX_DESCRIPTION_LENGTH} characters.`
    );
  }
};

const validateCategories = (categories) => {
  if (
    !Array.isArray(categories) ||
    !categories.every((cat) => validator.isAlpha(cat))
  ) {
    throw new ValidationError(
      "Invalid categories, It must be an array of alphabetic strings."
    );
  }
};

const validateDifficulty = (difficulty) => {
  if (!Object.values(DifficultyTypes).includes(difficulty)) {
    throw new ValidationError(
      "Invalid difficulty, It must be one of the allowed types."
    );
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
  if (
    !validator.isInt(String(passingScore), { min: 0, max: MAX_PASSING_SCORE })
  ) {
    throw new ValidationError(
      `Invalid passingScore, It must be between 0 and ${MAX_PASSING_SCORE}.`
    );
  }
};

const validateIsPublished = (isPublished) => {
  if (typeof isPublished !== "boolean") {
    throw new ValidationError("Invalid isPublished, It must be a boolean.");
  }
};

const validateQuestions = (questions) => {
  if (!Array.isArray(questions) || questions.length === 0) {
    throw new ValidationError(
      "Invalid questions, It must be a non-empty array."
    );
  }
};

const createQuiz = async (
  client,
  title,
  description,
  categories,
  difficulty,
  timeLimit,
  attemptLimit,
  dueDate,
  passingScore,
  isPublished,
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
  validateIsPublished(isPublished);
  validateQuestions(questions);

  const quiz = await quizRepository.createQuiz(
    client.id,
    title,
    description,
    categories,
    difficulty,
    timeLimit,
    attemptLimit,
    dueDate,
    passingScore,
    isPublished
  );

  // Try creating each question one by one
  const createdQuestions = [];

  for (let i = 0; i < questions.length; i++) {
    const { type, text, options, answer, points } = questions[i];
    try {
      const createdQuestion = await questionService.createQuestion(
        client,
        quiz,
        type,
        text,
        options,
        answer,
        points
      );

      createdQuestions.push(createdQuestion);
    } catch (error) {
      // Cleanup if any question fails

      await Promise.all(
        createdQuestions.map((question) =>
          questionService.deleteQuestion(client, question.id)
        )
      );

      await quizRepository.deleteQuiz(client.id, quiz.id);

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

module.exports = { createQuiz };
