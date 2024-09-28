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

const deleteQuiz = async (clientId, quizId) => {
  const { Quiz } = getModelsForClient(clientId);

  await Quiz.findOneAndDelete({ _id: quizId });
};

module.exports = { createQuiz, deleteQuiz };
