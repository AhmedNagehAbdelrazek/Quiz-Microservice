const mongoose = require("mongoose");
const { v4: generateUUID } = require("uuid");

const ClientSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: generateUUID,
  },
  name: {
    type: String,
    required: true,
  },
  client_id: {
    type: String,
    required: true,
  },
  client_secret_hash: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

const Client = mongoose.model("Client", ClientSchema);

module.exports = Client;
