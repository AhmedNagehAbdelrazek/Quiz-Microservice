const mongoose = require("mongoose");

const { ClientStatusTypes } = require("../../business-logic/enums");

const ClientSchema = new mongoose.Schema(
  {
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
    status: {
      type: String,
      enum: Object.values(ClientStatusTypes),
      default: ClientStatusTypes.ACTIVE,
    },
  },
  {
    timestamps: true,
  }
);

const Client = mongoose.model("Client", ClientSchema);

module.exports = Client;
