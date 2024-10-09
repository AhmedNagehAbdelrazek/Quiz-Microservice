const { getModelsForClient } = require("../models");

const createQuiz = async (clientId, data) => {
  const { Quiz } = getModelsForClient(clientId);

  const quiz = await Quiz.create(data);

  await quiz.populate("questions");

  return toDTO(quiz);
};

const updateQuiz = async (clientId, quizId, data) => {
  const { Quiz } = getModelsForClient(clientId);

  const quiz = await Quiz.findByIdAndUpdate(quizId, data, {
    new: true,
  });

  if (!quiz) {
    return null;
  }

  await quiz.populate("questions");

  return toDTO(quiz);
};

const deleteQuiz = async (clientId, quizId) => {
  const { Quiz } = getModelsForClient(clientId);

  const quiz = await Quiz.findByIdAndDelete(quizId);

  if (!quiz) {
    return null;
  }

  await quiz.populate("questions");

  return toDTO(quiz);
};

const retrieveQuiz = async (clientId, quizId) => {
  const { Quiz } = getModelsForClient(clientId);

  const quiz = await Quiz.findById(quizId);

  if (!quiz) {
    return null;
  }

  await quiz.populate("questions");

  return toDTO(quiz);
};

const retrieveQuizzes = async (clientId, filter, pagination) => {
  const { Quiz } = getModelsForClient(clientId);

  const quizzes = await Quiz.find(filter)
    .skip(pagination.skip)
    .limit(pagination.limit)
    .populate("questions");

  return quizzes.map(toDTO);
};

const countQuizzes = (clientId, filter) => {
  const { Quiz } = getModelsForClient(clientId);

  return Quiz.countDocuments(filter);
};

const toDTO = ({
  _id,
  title,
  description,
  categories,
  difficulty,
  timeLimit,
  attemptLimit,
  dueDate,
  passingScore,
  status,
  questions,
}) => {
  return {
    id: _id,
    title,
    description,
    categories,
    difficulty,
    timeLimit,
    attemptLimit,
    dueDate,
    passingScore,
    status,
    questions: questions.map(({ _id, type, text, options, answer, points }) => {
      return { id: _id, type, text, options, answer, points };
    }),
  };
};

module.exports = {
  createQuiz,
  updateQuiz,
  deleteQuiz,
  retrieveQuiz,
  retrieveQuizzes,
  countQuizzes,
};
