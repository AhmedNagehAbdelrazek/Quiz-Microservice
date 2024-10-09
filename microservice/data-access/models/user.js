const mongoose = require("mongoose");
const { v4: genUUID } = require("uuid");

const generateUserModelForClient = (id) => {
  const userSchema = new mongoose.Schema({
    _id: {
      type: String,
      default: genUUID,
    },
  });

  return mongoose.model(`User_${id}`, userSchema, `users_${id}`);
};

module.exports = generateUserModelForClient;
