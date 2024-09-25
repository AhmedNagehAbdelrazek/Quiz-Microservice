const mongoose = require("mongoose");

const { QuestionsTypes } = require("../../business-logic/enums");

const generateQuestionModelForClient = (id) => {
  const questionSchema = new mongoose.Schema(
    {
      quiz: {
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
        type: String,
        required: true,
      },
      points: {
        type: Number,
        default: 1,
      },
      partialCredit: {
        type: Boolean,
        default: true,
      },
    },
    { timestamps: true }
  );

  return mongoose.model(`Question_${id}`, questionSchema, `questions_${id}`);
};

module.exports = generateQuestionModelForClient;
