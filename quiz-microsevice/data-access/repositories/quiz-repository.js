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
  isPublished
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
    isPublished,
  });

  return toDTO(quiz);
};

const updateQuiz = async (clientId, id, update) => {
  const { Quiz } = getModelsForClient(clientId);

  const quiz = await Quiz.findByIdAndUpdate(id, update, {
    new: true,
  });

  return quiz ? toDTO(quiz) : null;
};

const deleteQuiz = async (clientId, id) => {
  const { Quiz } = getModelsForClient(clientId);

  await Quiz.findByIdAndDelete(id);
};

const retrieveQuiz = async (clientId, id) => {
  const { Quiz } = getModelsForClient(clientId);

  const quiz = await Quiz.findById(id);

  return quiz ? toDTO(quiz) : null;
};

const retrieveQuizzes = async (clientId, skip, limit) => {
  const { Quiz } = getModelsForClient(clientId);

  const quizzes = await Quiz.find().skip(skip).limit(limit);

  return quizzes.map(toDTO);
};

const countQuizzes = (clientId) => {
  const { Quiz } = getModelsForClient(clientId);

  return Quiz.countDocuments({});
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
  isPublished,
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
    isPublished,
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
