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

const updateQuiz = asyncHandler(async (req, res) => {
  const client = req.client;
  const { quizId } = req.params;
  const {
    title,
    description,
    categories,
    difficulty,
    timeLimit,
    attemptLimit,
    dueDate,
    passingScore,
    isPublished,
  } = req.body;

  const quiz = await quizService.updateQuiz(client.id, quizId, {
    title,
    description,
    categories,
    difficulty,
    timeLimit,
    attemptLimit,
    dueDate,
    passingScore,
    isPublished,
  });

  res.status(200).json({
    success: true,
    data: {
      quiz,
    },
  });
});

const publishQuiz = asyncHandler(async (req, res) => {
  const client = req.client;
  const { quizId } = req.params;

  const quiz = await quizService.publishQuiz(client.id, quizId);

  return res.status(200).json({
    success: true,
    data: {
      quiz: quiz,
    },
  });
});

const retrieveQuiz = asyncHandler(async (req, res) => {
  const client = req.client;
  const { quizId } = req.params;

  const quiz = await quizService.retrieveQuiz(client.id, quizId);

  return res.status(200).json({
    success: true,
    data: {
      quiz: quiz,
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

const addQuestionToQuiz = asyncHandler(async (req, res) => {
  const client = req.client;
  const { quizId } = req.params;
  const { type, text, options, answer, points } = req.body;

  const question = await quizService.addQuestionToQuiz(
    client.id,
    quizId,
    type,
    text,
    options,
    answer,
    points
  );

  res.status(201).json({
    success: true,
    data: {
      question,
    },
  });
});

const updateQuestionInQuiz = asyncHandler(async (req, res) => {
  const client = req.client;
  const { quizId, questionId } = req.params;
  const { type, text, options, answer, points } = req.body;

  const question = await quizService.updateQuestionInQuiz(
    client.id,
    quizId,
    questionId,
    { type, text, options, answer, options }
  );

  return res.status(200).json({
    success: true,
    data: {
      question,
    },
  });
});

const removeQuestionFormQuiz = asyncHandler(async (req, res) => {
  const client = req.client;
  const { quizId, questionId } = req.params;

  await quizService.removeQuestionFromQuiz(client.id, quizId, questionId);

  res.status(204).send();
});

module.exports = {
  createQuiz,
  updateQuiz,
  publishQuiz,
  retrieveQuiz,
  retrieveQuizzes,
  addQuestionToQuiz,
  updateQuestionInQuiz,
  removeQuestionFormQuiz,
};
