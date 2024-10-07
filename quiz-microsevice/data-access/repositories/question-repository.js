const { getModelsForClient } = require("../models");

const createQuizQuestion = async (
  clientId,
  quizId,
  type,
  text,
  options,
  answer,
  points
) => {
  const { Question } = getModelsForClient(clientId);

  const question = await Question.create({
    quizId,
    type,
    text,
    options,
    answer,
    points,
  });

  return toDTO(question);
};

const updateQuizQuestion = async (clientId, quizId, questionId, update) => {
  const { Question } = getModelsForClient(clientId);

  const question = await Question.findOneAndUpdate(
    { quizId, _id: questionId },
    update,
    {
      new: true,
    }
  );

  return question ? toDTO(question) : null;
};

const deleteQuizQuestion = async (clientId, quizId, questionId) => {
  const { Question } = getModelsForClient(clientId);

  const question = await Question.findOneAndDelete({ quizId, _id: questionId });

  return question ? toDTO(question) : null;
};

const deleteQuizQuestions = async (clientId, quizId) => {
  const { Question } = getModelsForClient(clientId);

  await Question.deleteMany({ quizId });
};

const retrieveQuizQuestion = async (clientId, quizId, questionId) => {
  const { Question } = getModelsForClient(clientId);

  const question = await Question.findOne({ quizId, _id: questionId });

  return question ? toDTO(question) : null;
};

const retrieveQuizQuestions = async (clientId, quizId, status) => {
  const { Question } = getModelsForClient(clientId);

  const questions = await Question.find({ quizId, status });

  return questions.map(toDTO);
};

const toDTO = ({ _id, type, text, options, answer, points, status }) => ({
  id: _id.toString(),
  type,
  text,
  options,
  answer,
  points,
  status,
});

module.exports = {
  createQuizQuestion,
  updateQuizQuestion,
  deleteQuizQuestion,
  deleteQuizQuestions,
  retrieveQuizQuestion,
  retrieveQuizQuestions,
};
