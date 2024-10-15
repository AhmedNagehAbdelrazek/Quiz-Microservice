const mongoose = require("mongoose");
const { v4: generateUUID } = require("uuid");

const generateUserModel = (id) => {
  const userSchema = new mongoose.Schema({
    _id: {
      type: String,
      default: generateUUID,
    },
  });

  return mongoose.model(`User_${id}`, userSchema, `users_${id}`);
};

module.exports = generateUserModel;
