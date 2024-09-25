const { getModelsForClient } = require("../models");

const toDTO = ({ _id, quiz, type, text, options, answer, partialCredit }) => {
  return {
    id: _id.toString(),
    quizId: quiz.toString(),
    type,
    text,
    options,
    answer,
    partialCredit,
  };
};

const createQuestion = async (
  clientId,
  quizId,
  type,
  text,
  options,
  answer,
  partialCredit
) => {
  const { Question } = getModelsForClient(clientId);

  const question = await Question.create({
    quiz: quizId,
    type,
    text,
    options,
    answer,
    partialCredit,
  });

  return toDTO(question);
};

module.exports = { createQuestion };
