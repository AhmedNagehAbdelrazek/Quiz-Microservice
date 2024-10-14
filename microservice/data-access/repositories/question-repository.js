const { getModels } = require("../models");

const createQuestion = async (
  clientId,
  { type, text, options, answer, points }
) => {
  const { Question } = getModels(clientId);

  const question = await Question.create({
    type,
    text,
    options,
    answer,
    points,
  });

  return toDTO(question);
};

const updateQuestion = async (
  clientId,
  questionId,
  { type, text, options, answer, points }
) => {
  const { Question } = getModels(clientId);

  const question = await Question.findByIdAndUpdate(
    questionId,
    { type, text, options, answer, points },
    {
      new: true,
    }
  );

  return question ? toDTO(question) : null;
};

const deleteQuestion = async (clientId, questionId) => {
  const { Question } = getModels(clientId);

  const question = await Question.findByIdAndDelete(questionId);

  return question ? toDTO(question) : null;
};

const retrieveQuestion = async (clientId, questionId) => {
  const { Question } = getModels(clientId);

  const question = await Question.findById(questionId);

  return question ? toDTO(question) : null;
};

const toDTO = (question) => ({
  id: question._id,
  type: question.type,
  text: question.text,
  options: question.options,
  answer: question.answer,
  points: question.points,
});

module.exports = {
  createQuestion,
  updateQuestion,
  deleteQuestion,
  retrieveQuestion,
};
