const { getModelsForClient } = require("../models");

const createQuestion = async (clientId, data) => {
  const { Question } = getModelsForClient(clientId);

  const question = await Question.create(data);

  return toDTO(question);
};

const updateQuestion = async (clientId, questionId, data) => {
  const { Question } = getModelsForClient(clientId);

  const question = await Question.findByIdAndUpdate(questionId, data, {
    new: true,
  });

  return question ? toDTO(question) : null;
};

const deleteQuestion = async (clientId, questionId) => {
  const { Question } = getModelsForClient(clientId);

  const question = await Question.findByIdAndDelete(questionId);

  return question ? toDTO(question) : null;
};

const retrieveQuestion = async (clientId, questionId) => {
  const { Question } = getModelsForClient(clientId);

  const question = await Question.findById(questionId);

  return question ? toDTO(question) : null;
};

const toDTO = (question) => ({
  id: question._id,
  type: question.type,
  text: question.text,
  options: question.options,
  correctAnswer: question.correctAnswer,
  points: question.points,
});

module.exports = {
  createQuestion,
  updateQuestion,
  deleteQuestion,
  retrieveQuestion,
};
