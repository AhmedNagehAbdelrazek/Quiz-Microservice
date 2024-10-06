const { getModelsForClient } = require("../models");

const addQuestionToQuiz = async (
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

const updateQuestionInQuiz = async (clientId, quizId, id, update) => {
  const { Question } = getModelsForClient(clientId);

  const question = await Question.findOneAndUpdate(
    { quizId, _id: id },
    update,
    {
      new: true,
    }
  );

  return question ? toDTO(question) : null;
};

const removeQuestionFromQuiz = async (clientId, quizId, id) => {
  const { Question } = getModelsForClient(clientId);

  const question = await Question.findOneAndDelete({ quizId, _id: id });

  return question ? toDTO(question) : null;
};

const removeAllQuestionsFromQuiz = async (clientId, quizId) => {
  const { Question } = getModelsForClient(clientId);

  await Question.deleteMany({ quizId });
};

const retrieveQuestionFromQuiz = async (clientId, quizId, id) => {
  const { Question } = getModelsForClient(clientId);

  const question = await Question.findOne({ quizId, _id: id });

  return question ? toDTO(question) : null;
};

const retrieveAllQuestionsFromQuiz = async (clientId, quizId) => {
  const { Question } = getModelsForClient(clientId);

  const questions = await Question.find({ quizId });

  return questions.map(toDTO);
};

const toDTO = ({ _id, type, text, options, answer, points }) => ({
  id: _id.toString(),
  type,
  text,
  options,
  answer,
  points,
});

module.exports = {
  addQuestionToQuiz,
  updateQuestionInQuiz,
  removeQuestionFromQuiz,
  removeAllQuestionsFromQuiz,
  retrieveQuestionFromQuiz,
  retrieveAllQuestionsFromQuiz,
};
