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
  enabled: {
    type: Boolean,
    required: true,
  },
});

const Client = mongoose.model("Client", ClientSchema);

module.exports = Client;
