#!/usr/bin/env node
require("dotenv").config();

const mongoose = require("mongoose");
const readline = require("readline");

const { createClient } = require("./actions");

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
