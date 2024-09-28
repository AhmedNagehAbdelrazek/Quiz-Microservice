const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  clientId: {
    type: String,
    required: true,
  },
  clientSecretHash: {
    type: String,
    required: true,
  },
  isEnabled: {
    type: Boolean, 
    default: false,
  }
});

const Client = mongoose.model("Client", ClientSchema);

module.exports = Client;
