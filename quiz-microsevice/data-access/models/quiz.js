const mongoose = require("mongoose");

const { DifficultyTypes, GradingTypes } = require("../../business-logic/enums");

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
        enum: Object.values(DifficultyTypes),
        default: DifficultyTypes.EASY,
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
      gradingType: {
        type: String,
        enum: Object.values(GradingTypes),
        default: GradingTypes.MANUAL,
      },
      isPublished: {
        type: Boolean,
        default: false,
      },
    },
    { timestamps: true }
  );

  return mongoose.model(`Quiz_${id}`, quizSchema, `quizzes_${id}`);
};

module.exports = generateQuizModelForClient;
