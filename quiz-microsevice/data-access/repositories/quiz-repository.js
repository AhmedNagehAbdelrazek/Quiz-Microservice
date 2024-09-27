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

const deleteQuiz = async (clientId, id) => {
  const { Quiz } = getModelsForClient(clientId);

  await Quiz.findOneAndDelete({ _id: id });
};

const retrieveSpecificQuiz = async (client, quizId) => {
  const { Quiz } = getModelsForClient(client);
  
  const quiz = await Quiz.findById(quizId);
   
  return toDTO(quiz);
};

module.exports = { createQuiz, deleteQuiz, retrieveSpecificQuiz };

