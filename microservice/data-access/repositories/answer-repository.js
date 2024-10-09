const { getModelsForClient } = require("../models");

const createAnswer = async (clientId, data) => {
  const { Answer } = getModelsForClient(clientId);

  const answer = await Answer.create(data);

  await answer.populate("question");

  return toDTO(answer);
};

const toDTO = (answer) => {
  return {
    id: answer._id,
    question: {
      id: answer.question._id,
      type: answer.question.type,
      text: answer.question.text,
      options: answer.question.options,
      correctAnswer: answer.question.correctAnswer,
      points: answer.question.points,
    },
    answer: answer.answer,
    score: answer.score,
  };
};

module.exports = { createAnswer };
