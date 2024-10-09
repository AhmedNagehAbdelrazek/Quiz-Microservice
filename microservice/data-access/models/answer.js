const mongoose = require("mongoose");
const { v4: genUUID } = require("uuid");

const generateAnswerModelForClient = (id) => {
  const answerSchema = new mongoose.Schema({
    _id: {
      type: String,
      default: genUUID,
    },
    question: {
      type: String,
      ref: `Question_${id}`,
    },
    answer: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    score: {
      type: Number,
      default: 0,
    },
  });

  return mongoose.model(`Answer_${id}`, answerSchema, `answers_${id}`);
};

module.exports = generateAnswerModelForClient;
