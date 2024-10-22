const { getModels } = require("../models");
const { AttemptStatus } = require("../../business-logic/enums");

const toDTO = (attempt) => {
  return {
    id: attempt._id,
    userId: attempt.user,
    quizId: attempt.quiz,
    startedAt: attempt.startedAt,
    submittedAt: attempt.submittedAt,
    status: attempt.status,
    responses: attempt.responses,
  };
};

const createAttempt = async (
  clientId,
  { userId, quizId, startedAt, submittedAt, status, responses } = {}
) => {
  const { Attempt } = getModels(clientId);

  const attempt = await Attempt.create({
    user: userId,
    quiz: quizId,
    startedAt,
    submittedAt,
    status,
    responses,
  });

  return attempt;
};

const retrieveActiveAttempt = async (clientId, userId) => {
  const { Attempt } = getModels(clientId);

  const attempt = await Attempt.findOne({
    user: userId,
    status: AttemptStatus.STARTED,
  });

  return attempt ? toDTO(attempt) : null;
};

const countAttempts = (clientId, userId, quizId) => {
  const { Attempt } = getModels(clientId);

  return Attempt.countDocuments({
    user: userId,
    quiz: quizId,
  });
};

module.exports = {
  createAttempt,
  retrieveActiveAttempt,
  countAttempts,
};
