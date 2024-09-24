#!/usr/bin/env node
require("dotenv").config();

const mongoose = require("mongoose");
const readline = require("readline");

const { createClient, 
  retrieveAllClients, 
  regenerateClientCredentials, 
  renameClient, 
  disableClient, 
  enableClient, } = require("./actions");

const cli = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "quiz-microservice-cli> ",
});

cli
  .on("line", async (input) => {
    const [command, ...args] = input.trim().split(" ");

    try {
      switch (command) {
        case "create-client":
          const [name] = args;

          await createClient(name);
          break;
        case 'regenerate-client-credentials':
          const [id] = args;
          await regenerateClientCredentials(id)
          break;
          
        case "list-clients":
          await retrieveAllClients();
          break;

// I've changed the vars name (ID, Id) because these vars is locally, so it's make conflict.
        case "rename-client":
          const [ID, newName] = args;
          await renameClient(ID, newName);
          break;

        case "disable-client":
          const [Id] = args;
          await disableClient(Id);
          break;

        case "enable-client":
          const [iD] = args;
          await enableClient(iD);
          break;

        case "exit":
        case "quit":
          console.log("Goodbye!");

          process.exit(0);

        default:
          console.log(`Command not found: ${command}`);
      }
    } catch (error) {
      console.error(error);
    }

    cli.prompt();
  })
  .on("close", () => {
    console.log("Goodbye!");

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
