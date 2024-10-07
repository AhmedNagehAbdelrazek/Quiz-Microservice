const mongoose = require("mongoose");

const { ClientStatus } = require("../../business-logic/enums");

const ClientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    oauthId: {
      type: String,
      required: true,
    },
    oauthSecretHash: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ClientStatus),
      default: ClientStatus.ACTIVE,
    },
  },
  {
    timestamps: true,
  }
);

const Client = mongoose.model("Client", ClientSchema);

module.exports = Client;
