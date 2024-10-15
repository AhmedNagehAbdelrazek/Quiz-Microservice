const mongoose = require("mongoose");
const { v4: generateUUID } = require("uuid");

const generateResponseModel = (id) => {
  const responseSchema = new mongoose.Schema({
    _id: {
      type: String,
      default: generateUUID,
    },
    question: {
      type: String,
      ref: `Question_${id}`,
      required: true,
    },
    answer: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    score: {
      type: Number,
      default: null,
    },
  });

  return mongoose.model(`Response_${id}`, responseSchema, `responses_${id}`);
};

module.exports = generateResponseModel;
