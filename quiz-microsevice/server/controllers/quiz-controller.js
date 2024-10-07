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

const unpublishQuiz = asyncHandler(async (req, res) => {
  const client = req.client;
  const { quizId } = req.params;

  const quiz = await quizService.unpublishQuiz(client.id, quizId);

  return res.status(200).json({
    success: true,
    data: {
      quiz: quiz,
    },
  });
});

const archiveQuiz = asyncHandler(async (req, res) => {
  const client = req.client;
  const { quizId } = req.params;

  const quiz = await quizService.archiveQuiz(client.id, quizId);

  return res.status(200).json({
    success: true,
    data: {
      quiz: quiz,
    },
  });
});

const unarchiveQuiz = asyncHandler(async (req, res) => {
  const client = req.client;
  const { quizId } = req.params;

  const quiz = await quizService.unarchieQuiz(client.id, quizId);

  return res.status(200).json({
    success: true,
    data: {
      quiz: quiz,
    },
  });
});

const deletedQuiz = asyncHandler(async (req, res) => {
  const client = req.client;
  const { quizId } = req.params;
  const { type } = req.query;

  await quizService.deleteQuiz(client.id, quizId, type);

  return res.sendStatus(204);
});

const restoreQuiz = asyncHandler(async (req, res) => {
  const client = req.client;
  const { quizId } = req.params;

  const quiz = await quizService.restoreQuiz(client.id, quizId);

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
  const { page, limit, status } = req.query;

  const { quizzes, pagination } = await quizService.retrieveQuizzes(
    client.id,
    page,
    limit,
    status
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

const createQuizQuestion = asyncHandler(async (req, res) => {
  const client = req.client;
  const { quizId } = req.params;
  const { type, text, options, answer, points } = req.body;

  const question = await quizService.createQuizQuestion(
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

const updateQuizQuestion = asyncHandler(async (req, res) => {
  const client = req.client;
  const { quizId, questionId } = req.params;
  const { type, text, options, answer, points } = req.body;

  const question = await quizService.updateQuizQuestion(
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

const deleteQuizQuestion = asyncHandler(async (req, res) => {
  const client = req.client;
  const { quizId, questionId } = req.params;
  const { type } = req.query;

  await quizService.deleteQuizQuestion(client.id, quizId, questionId, type);

  res.status(204).send();
});

const restoreQuizQuestion = asyncHandler(async (req, res) => {
  const client = req.client;
  const { quizId, questionId } = req.params;

  const question = await quizService.restoreQuizQuestion(
    client.id,
    quizId,
    questionId
  );

  res.status(200).json({
    success: true,
    data: {
      question,
    },
  });
});

const retrieveQuizQuestions = asyncHandler(async (req, res) => {
  const client = req.client;
  const { quizId } = req.params;
  const { status } = req.query;

  const questions = await quizService.retrieveQuizQuestions(
    client.id,
    quizId,
    status
  );

  res.status(200).json({
    success: true,
    data: {
      questions,
    },
  });
});

module.exports = {
  createQuiz,
  updateQuiz,
  publishQuiz,
  unpublishQuiz,
  archiveQuiz,
  unarchiveQuiz,
  deletedQuiz,
  restoreQuiz,
  retrieveQuiz,
  retrieveQuizzes,
  createQuizQuestion,
  updateQuizQuestion,
  deleteQuizQuestion,
  restoreQuizQuestion,
  retrieveQuizQuestions,
};
