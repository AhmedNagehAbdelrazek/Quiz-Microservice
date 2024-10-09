const { getModelsForClient } = require("../models");

const createAttempt = async (clientId, data) => {
  const { Attempt } = getModelsForClient(clientId);

  const attempt = await Attempt.create(data);

  await attempt.populate({
    path: "answers",
    populate: {
      path: "question",
    },
  });

  return toDTO(attempt);
};

const toDTO = (attempt) => {
  return {
    id: attempt._id,
    title: attempt.title,
    description: attempt.description,
    timeLimit: attempt.timeLimit,
    dueDate: attempt.dueDate,
    startDate: attempt.startDate,
    endDate: attempt.endDate,
    passingScore: attempt.passingScore,
    score: attempt.score,
    status: attempt.status,
    answers: attempt.answers.map((a) => {
      return {
        id: a._id,
        question: {
          id: a.question._id,
          type: a.question.type,
          text: a.question.text,
          options: a.question.options,
          correctAnswer: a.question.correctAnswer,
          points: a.question.points,
        },
        answer: a.answer,
        score: a.score,
      };
    }),
  };
};

module.exports = { createAttempt };
