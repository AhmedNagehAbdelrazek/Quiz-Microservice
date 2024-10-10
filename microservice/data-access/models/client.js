const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  client_id: {
    type: String,
    required: true,
  },
  client_secret: {
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
