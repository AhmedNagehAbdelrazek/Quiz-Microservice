const validator = require("validator");
const crypto = require("crypto");
const { v4: generateUUID } = require("uuid");

const { ClientStatus } = require("../enums");
const { ValidationError, InvalidStatusError } = require("../errors/common");

const CLIENT_NAME_LENGTH = { min: 1, max: 50 };

module.exports = ClientStatus;

class Client {
  #id;
  #name;
  #client_id;
  #client_secret;
  #status;

  constructor({
    id = generateUUID(),
    name,
    client_id = crypto.randomBytes(20).toString("hex"),
    client_secret = crypto.randomBytes(20).toString("hex"),
    status = ClientStatus.ACTIVE,
  } = {}) {
    this.#id = id;
    this.name = name;
    this.#client_id = client_id;
    this.#client_secret = client_secret;
    this.status = status;
  }

  get id() {
    return this.#id;
  }

  set name(name) {
    if (
      typeof name !== "string" ||
      !validator.isLength(name, CLIENT_NAME_LENGTH)
    ) {
      throw new ValidationError(
        `Invalid 'name', it must be a string between ${CLIENT_NAME_LENGTH.min} and ${CLIENT_NAME_LENGTH.max} characters.`
      );
    }

    this.#name = name;
  }

  get name() {
    return this.#name;
  }

  get client_id() {
    return this.#client_id;
  }

  get client_secret() {
    return this.#client_secret;
  }

  set status(status) {
    if (!Object.values(ClientStatus).includes(status)) {
      throw new ValidationError("Invalid 'status'.");
    }

    this.#status = status;
  }

  get status() {
    return this.#status;
  }

  regenerateCredentials() {
    this.#client_id = crypto.randomBytes(20).toString("hex");
    this.#client_secret = crypto.randomBytes(20).toString("hex");
  }

  activateClient() {
    if (this.status === ClientStatus.ACTIVE) {
      throw new InvalidStatusError("This client is already active.");
    }

    this.status = ClientStatus.ACTIVE;
  }

  deactivateClient() {
    if (this.status === ClientStatus.INACTIVE) {
      throw new InvalidStatusError("This client is already inactive.");
    }

    this.status = ClientStatus.INACTIVE;
  }

  toObject() {
    return Object.freeze({
      id: this.id,
      name: this.name,
      client_id: this.client_id,
      client_secret: this.client_secret,
      status: this.status,
    });
  }
}

module.exports = Client;
