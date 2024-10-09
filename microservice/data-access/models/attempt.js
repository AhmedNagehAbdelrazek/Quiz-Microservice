const mongoose = require("mongoose");
const { v4: genUUID } = require("uuid");

const { AttemptStatus } = require("../../business-logic/enums");

const generateAttemptModelForClient = (id) => {
  const attemptSchema = new mongoose.Schema({
    _id: {
      type: String,
      default: genUUID,
    },
    user: {
      type: String,
      ref: `User_${id}`,
      required: true,
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
    dueDate: {
      type: Date,
      default: null,
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
    passingScore: {
      type: Number,
      default: 0,
    },
    score: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: Object.values(AttemptStatus),
      default: AttemptStatus.STARTED,
    },
    answers: [{ type: String, ref: `Answer_${id}` }],
  });

  return mongoose.model(`Attempt_${id}`, attemptSchema, `attempts_${id}`);
};

module.exports = generateAttemptModelForClient;
