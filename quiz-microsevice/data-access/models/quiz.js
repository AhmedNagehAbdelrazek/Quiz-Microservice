const mongoose = require("mongoose");

const { DifficultyType, QuizStatus } = require("../../business-logic/enums");

const generateQuizModelForClient = (id) => {
  const quizSchema = new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      categories: [String],
      difficulty: {
        type: String,
        enum: Object.values(DifficultyType),
        default: DifficultyType.EASY,
      },
      timeLimit: {
        type: Number,
        default: null,
      },
      attemptLimit: {
        type: Number,
        default: null,
      },
      dueDate: {
        type: Date,
        default: null,
      },
      passingScore: {
        type: Number,
        default: 50,
      },
      status: {
        type: String,
        enum: Object.values(QuizStatus),
        default: QuizStatus.DRAFTED,
      },
    },
    { timestamps: true }
  );

  return mongoose.model(`Quiz_${id}`, quizSchema, `quizzes_${id}`);
};

module.exports = generateQuizModelForClient;
