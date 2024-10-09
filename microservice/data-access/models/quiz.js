const mongoose = require("mongoose");
const { v4: genUUID } = require("uuid");

const { QuizStatus, QuizDifficulty } = require("../../business-logic/enums");

const generateQuizModelForClient = (id) => {
  const quizSchema = new mongoose.Schema(
    {
      _id: {
        type: String,
        default: genUUID,
      },
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
        enum: Object.values(QuizDifficulty),
        default: QuizDifficulty.EASY,
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
        default: 0,
      },
      status: {
        type: String,
        enum: Object.values(QuizStatus),
        default: QuizStatus.DRAFTED,
      },
      questions: [{ type: String, ref: `Question_${id}` }],
    },
    { timestamps: true }
  );

  return mongoose.model(`Quiz_${id}`, quizSchema, `quizzes_${id}`);
};

module.exports = generateQuizModelForClient;
