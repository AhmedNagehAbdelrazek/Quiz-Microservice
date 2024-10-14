const mongoose = require("mongoose");
const { v4: generateUUID } = require("uuid");

const generateQuestionModel = (id) => {
  const questionSchema = new mongoose.Schema({
    _id: {
      type: String,
      default: generateUUID,
    },
    type: {
      type: String,
      required: true,
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
      required: true,
    },
  });

  return mongoose.model(`Question_${id}`, questionSchema, `questions_${id}`);
};

module.exports = generateQuestionModel;
