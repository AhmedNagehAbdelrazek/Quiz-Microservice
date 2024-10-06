const mongoose = require("mongoose");

const { QuestionsTypes } = require("../../business-logic/enums");

const generateQuestionModelForClient = (id) => {
  const questionSchema = new mongoose.Schema(
    {
      quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: `Quiz_${id}`,
        required: true,
      },
      type: {
        type: String,
        enum: Object.values(QuestionsTypes),
        default: QuestionsTypes.SHORT_ANSWER,
      },
      text: {
        type: String,
        required: true,
      },
      options: {
        type: [String],
        default: null,
      },
      answer: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
      },
      points: {
        type: Number,
        default: 1,
      },
    },
    { timestamps: true }
  );

  return mongoose.model(`Question_${id}`, questionSchema, `questions_${id}`);
};

module.exports = generateQuestionModelForClient;
