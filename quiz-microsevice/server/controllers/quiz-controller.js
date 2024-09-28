const asyncHandler = require("express-async-handler");

const { quizService } = require("../../business-logic/services");

const createQuiz = asyncHandler(async (req, res) => {
  const client = req.client;
  const {
    title,
    description,
    categories,
    difficulty,
    timeLimit,
    attemptLimit,
    dueDate,
    passingScore,
    questions,
  } = req.body;

  const quiz = await quizService.createQuiz(
    client.id,
    title,
    description,
    categories,
    difficulty,
    timeLimit,
    attemptLimit,
    dueDate,
    passingScore,
    questions
  );

  res.status(201).json({
    success: true,
    data: {
      quiz,
    },
  });
});

const retrieveQuizzes = asyncHandler(async (req, res) => {
  const client = req.client;
  const { page = 1, limit = 20 } = req.query;

  const { quizzes, pagination } = await quizService.retrieveQuizzes(
    client.id,
    page,
    limit
  );

  return res.status(200).json({
    success: true,
    data: {
      quizzes,
    },
    metadata: {
      pagination,
    },
  });
});

module.exports = { createQuiz, retrieveQuizzes };
