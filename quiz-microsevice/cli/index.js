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
  activateClient,
  deactivateClient,
  retrieveClients,
} = require("./actions");

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

        case "activate-client": {
          const [id] = args;
          await activateClient(id);
          break;
        }

        case "deactivate-client": {
          const [id] = args;
          await deactivateClient(id);
          break;
        }

        case "retrieve-clients": {
          const [page = 1, limit = 20] = args;
          await retrieveClients(page, limit);
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
