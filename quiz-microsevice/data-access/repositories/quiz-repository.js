const { getModelsForClient } = require("../models");

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

const createQuiz = async (
  clientId,
  title,
  description,
  categories,
  difficulty,
  timeLimit,
  attemptLimit,
  dueDate,
  passingScore
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
  });

  return toDTO(quiz);
};

const retrieveQuizzes = async (clientId, skip, limit) => {
  const { Quiz } = getModelsForClient(clientId);

  const quizzes = await Quiz.find({}).skip(skip).limit(limit);

  return quizzes.map(toDTO);
};

const countQuizzes = (clientId) => {
  const { Quiz } = getModelsForClient(clientId);

  return Quiz.countDocuments({});
};

const retrieveQuiz = async (clientId, quizId) => {
  const { Quiz } = getModelsForClient(clientId);

  const quiz = await Quiz.findById(quizId);

  if (!quiz) {
    return null;
  }

  return toDTO(quiz);
};

const updateQuiz = async (clientId, quizId, update) => {
  const { Quiz } = getModelsForClient(clientId);

  const quiz = await Quiz.findOneAndUpdate({ _id: quizId }, update, {
    new: true,
  });

  if (!quiz) {
    return null;
  }

  return toDTO(quiz);
};

const deleteQuiz = async (clientId, quizId) => {
  const { Quiz } = getModelsForClient(clientId);

  await Quiz.findOneAndDelete({ _id: quizId });
};

module.exports = {
  createQuiz,
  retrieveQuizzes,
  countQuizzes,
  retrieveQuiz,
  updateQuiz,
  deleteQuiz,
};
