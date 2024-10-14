const mongoose = require("mongoose");
const { v4: generateUUID } = require("uuid");

const generateQuizModel = (id) => {
  const quizSchema = new mongoose.Schema({
    _id: {
      type: String,
      default: generateUUID,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    timeLimit: {
      type: Number,
      default: null,
    },
    attemptLimit: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      required: true,
    },
    questions: [{ type: String, ref: `Question_${id}` }],
  });

  return mongoose.model(`Quiz_${id}`, quizSchema, `quizzes_${id}`);
};

module.exports = generateQuizModel;
