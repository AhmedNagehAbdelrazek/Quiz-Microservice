const { getModelsForClient } = require("../models");

const toDTO = ({ _id, quiz, type, text, options, answer, points }) => {
  return {
    id: _id.toString(),
    quizId: quiz.toString(),
    type,
    text,
    options,
    answer,
    points,
  };
};

const createQuestion = async (
  clientId,
  quizId,
  type,
  text,
  options,
  answer
) => {
  const { Question } = getModelsForClient(clientId);

  const question = await Question.create({
    quiz: quizId,
    type,
    text,
    options,
    answer,
  });

  return toDTO(question);
};

const deleteQuestion = async (clientId, questionId) => {
  const { Question } = getModelsForClient(clientId);

  await Question.findOneAndDelete({ _id: questionId });
};

const deleteQuestionsForQuiz = async (clientId, quizId) => {
  const { Question } = getModelsForClient(clientId);

  await Question.deleteMany({ quiz: quizId });
};

module.exports = { createQuestion, deleteQuestion, deleteQuestionsForQuiz };
