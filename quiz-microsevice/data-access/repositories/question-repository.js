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

const retrieveQuestionsForQuiz = async (clientId, quizId) => {
  const { Question } = getModelsForClient(clientId);

  const questions = await Question.find({ quiz: quizId });

  return questions.map(toDTO);
};

const deleteQuestionsForQuiz = async (clientId, quizId) => {
  const { Question } = getModelsForClient(clientId);

  await Question.deleteMany({ quiz: quizId });
};


const deleteOneQuestionForQuiz = async (clientId, questionId) => {
  const { Question } = getModelsForClient(clientId);

  await Question.deleteOne({ _id: questionId });
};

module.exports = {
  createQuestion,
  deleteQuestion,
  retrieveQuestionsForQuiz,
  deleteQuestionsForQuiz,
  deleteOneQuestionForQuiz,
};
