#!/usr/bin/env node
require("dotenv").config();

const mongoose = require("mongoose");
const readline = require("readline");
const fs = require("fs");
const path = require("path");

const {
  createClient,
  renameClient,
  regenerateClientCredentials,
  deleteClient,
  restoreClient,
  retrieveClients,
} = require("./actions");

const { ClientStatus } = require("../business-logic/enums");
const { ValidationError } = require("../business-logic/errors/common");

// History file path
const historyFilePath = path.join(__dirname, ".cli-history");

// Load history from file
const loadHistory = () => {
  if (fs.existsSync(historyFilePath)) {
    return fs
      .readFileSync(historyFilePath, "utf-8")
      .split("\n")
      .filter(Boolean);
  }
  return [];
};

// Save history to file
const saveHistory = (history) => {
  fs.writeFileSync(historyFilePath, history.join("\n"));
};

// Set up readline with history support
const cli = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "quiz-microservice-cli> ",
  historySize: 100, // Limit history to the last 100 commands
});

// Load history into readline
cli.history = loadHistory();

cli
  .on("line", async (input) => {
    const [command, ...args] = input.trim().split(" ");

    try {
      switch (command) {
        case "create-client": {
          const [name] = args;
          await createClient(name);
          break;
        }

        case "rename-client": {
          const [id, name] = args;
          await renameClient(id, name);
          break;
        }

        case "regenerate-client-credentials": {
          const [id] = args;
          await regenerateClientCredentials(id);
          break;
        }

        case "delete-client": {
          const [id] = args;
          await deleteClient(id);
          break;
        }

        case "restore-client": {
          const [id] = args;
          await restoreClient(id);
          break;
        }

        case "retrieve-clients": {
          const [page, limit] = args;
          await retrieveClients(page, limit);
          break;
        }

        case "retrieve-deleted-clients": {
          const [page, limit] = args;
          await retrieveClients(page, limit, ClientStatus.DELETED);
          break;
        }

        case "exit":
        case "quit":
          console.log("Goodbye!");
          saveHistory(cli.history);
          process.exit(0);

        default:
          console.log(`Command not found: ${command}`);
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        console.log(error.message);
      } else {
        console.error(error);
      }
    }

    cli.prompt();
  })
  .on("close", () => {
    console.log("Goodbye!");

    saveHistory(cli.history);

    process.exit(0);
  });

const MONGO_URI = process.env.MONGO_URI;

const bootstrap = async () => {
  try {
    mongoose.connect(MONGO_URI);

    cli.prompt();
  } catch (e) {
    console.error(e);

    process.exit(1);
  }
};

bootstrap();
