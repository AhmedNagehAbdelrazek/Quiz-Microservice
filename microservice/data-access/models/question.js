const mongoose = require("mongoose");
const { v4: genUUID } = require("uuid");

const { QuestionsType } = require("../../business-logic/enums");

const generateQuestionModelForClient = (id) => {
  const questionSchema = new mongoose.Schema(
    {
      _id: {
        type: String,
        default: genUUID,
      },
      type: {
        type: String,
        enum: Object.values(QuestionsType),
        default: QuestionsType.SHORT_ANSWER,
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
