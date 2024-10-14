const { getModels } = require("../models");

const createQuiz = async (
  clientId,
  { title, description, timeLimit, attemptLimit, status, questions }
) => {
  const { Quiz } = getModels(clientId);

  const quiz = await Quiz.create({
    title,
    description,
    timeLimit,
    attemptLimit,
    status,
    questions,
  });

  return toDTO(quiz);
};

const updateQuiz = async (
  clientId,
  quizId,
  { title, description, timeLimit, attemptLimit, status, questions }
) => {
  const { Quiz } = getModels(clientId);

  const quiz = await Quiz.findByIdAndUpdate(
    quizId,
    { title, description, timeLimit, attemptLimit, status, questions },
    {
      new: true,
    }
  );

  return quiz ? toDTO(quiz) : null;
};

const deleteQuiz = async (clientId, quizId) => {
  const { Quiz } = getModels(clientId);

  const quiz = await Quiz.findByIdAndDelete(quizId);

  return quiz ? toDTO(quiz) : null;
};

const retrieveQuiz = async (clientId, quizId) => {
  const { Quiz } = getModels(clientId);

  const quiz = await Quiz.findById(quizId);

  return quiz ? toDTO(quiz) : null;
};

const retrieveQuizzes = async (clientId, { status }, { skip, limit }) => {
  const { Quiz } = getModels(clientId);

  const quizzes = await Quiz.find({ status }).skip(skip).limit(limit);

  return quizzes.map(toDTO);
};

const countQuizzes = (clientId, { status }) => {
  const { Quiz } = getModels(clientId);

  return Quiz.countDocuments({ status });
};

const toDTO = (quiz) => {
  return {
    id: quiz._id,
    title: quiz.title,
    description: quiz.description,
    timeLimit: quiz.timeLimit,
    attemptLimit: quiz.attemptLimit,
    status: quiz.status,
    questions: quiz.questions,
  };
};

module.exports = {
  createQuiz,
  updateQuiz,
  deleteQuiz,
  retrieveQuiz,
  retrieveQuizzes,
  countQuizzes,
};
