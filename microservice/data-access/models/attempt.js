const mongoose = require("mongoose");
const { v4: generateUUID } = require("uuid");

const generateAttemptModel = (id) => {
  const attemptSchema = new mongoose.Schema({
    _id: {
      type: String,
      default: generateUUID,
    },
    user: {
      type: String,
      ref: `User_${id}`,
      required: true,
    },
    quiz: {
      type: String,
      ref: `Quiz_${id}`,
      required: true,
    },
    startedAt: {
      type: Date,
      required: Date.now,
    },
    submittedAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      required: true,
    },
    responses: [{ type: String, ref: `Response_${id}` }],
  });

  return mongoose.model(`Attempt_${id}`, attemptSchema, `attempts_${id}`);
};

module.exports = generateAttemptModel;
