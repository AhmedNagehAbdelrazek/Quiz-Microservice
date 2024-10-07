const { getModelsForClient } = require("../models");

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
  status
) => {
  const { Quiz } = getModelsForClient(clientId);

  const quiz = await Quiz.create({
    title,
    description,
    categories,
    difficulty,
    timeLimit,
    attemptLimit,
    dueDate,
    passingScore,
    status,
  });

  return toDTO(quiz);
};

const updateQuiz = async (clientId, quizId, update) => {
  const { Quiz } = getModelsForClient(clientId);

  const quiz = await Quiz.findByIdAndUpdate(quizId, update, {
    new: true,
  });

  return quiz ? toDTO(quiz) : null;
};

const deleteQuiz = async (clientId, quizId) => {
  const { Quiz } = getModelsForClient(clientId);

  await Quiz.findByIdAndDelete(quizId);
};

const retrieveQuiz = async (clientId, quizId) => {
  const { Quiz } = getModelsForClient(clientId);

  const quiz = await Quiz.findById(quizId);

  return quiz ? toDTO(quiz) : null;
};

const retrieveQuizzes = async (clientId, skip, limit, status) => {
  const { Quiz } = getModelsForClient(clientId);

  const quizzes = await Quiz.find({ status }).skip(skip).limit(limit);

  return quizzes.map(toDTO);
};

const countQuizzes = (clientId, status) => {
  const { Quiz } = getModelsForClient(clientId);

  return Quiz.countDocuments({ status });
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
}) => {
  return {
    id: _id.toString(),
    title,
    description,
    categories,
    difficulty,
    timeLimit,
    attemptLimit,
    dueDate,
    passingScore,
    status,
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
