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

const { DeleteType, ClientStatus } = require("../business-logic/enums");
const {
  ValidationError,
  NotExistError,
} = require("../business-logic/errors/common");

const historyFilePath = path.join(__dirname, "../.cli-history");

const loadHistory = () => {
  if (fs.existsSync(historyFilePath)) {
    return fs
      .readFileSync(historyFilePath, "utf-8")
      .split("\n")
      .filter(Boolean);
  }
  return [];
};

const saveHistory = (history) => {
  fs.writeFileSync(historyFilePath, history.join("\n"));
};

const parseTokens = (tokens, { arguments = {}, flags = {} }) => {
  const result = { arguments: {}, flags: {} };

  const parseValue = (value, type) => {
    switch (type) {
      case "string": {
        return value;
      }

      case "number": {
        const num = Number(value);
        if (isNaN(num)) throw new Error(`Invalid number: ${value}`);
        return num;
      }

      case "boolean": {
        if (value === undefined || value === "true") return true;
        if (value === "false") return false;
        throw new Error(`Invalid boolean value: ${value}`);
      }

      default: {
        throw new Error(`Unknown type: ${type}`);
      }
    }
  };

  for (const key in arguments) {
    const type = arguments[key];

    if (tokens.length === 0 || tokens[0].startsWith("--")) {
      throw new Error(`Missing "${key}" argument.`);
    }

    const value = tokens.shift();

    result.arguments[key] = parseValue(value, type);
  }

  while (tokens.length) {
    const token = tokens.shift();

    if (!token.startsWith("--")) {
      throw new Error(`Unexpected argument: ${token}`);
    }

    const [key, value] = token.split("=");

    if (!(key in flags)) {
      throw new Error(`Unknown flag: ${key}`);
    }

    result.flags[key] = parseValue(value, flags[key]);
  }

  return result;
};

const cli = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "cli> ",
  historySize: 100,
});

cli.history = loadHistory();

cli
  .on("line", async (input) => {
    const [command, ...tokens] = input.trim().split(" ");

    try {
      switch (command) {
        case "create-client": {
          const { arguments } = parseTokens(tokens, {
            arguments: { name: "string" },
          });

          await createClient(arguments.name);
          break;
        }

        case "rename-client": {
          const { arguments } = parseTokens(tokens, {
            arguments: { id: "string", name: "string" },
          });

          await renameClient(arguments.id, arguments.name);
          break;
        }

        case "regenerate-client-credentials": {
          const { arguments } = parseTokens(tokens, {
            arguments: { id: "string" },
          });

          await regenerateClientCredentials(arguments.id);
          break;
        }

        case "delete-client": {
          const { arguments, flags } = parseTokens(tokens, {
            arguments: { id: "string" },
            flags: { "--hard": "boolean" },
          });

          const type = flags["--hard"] ? DeleteType.HARD : DeleteType.SOFT;

          await deleteClient(arguments.id, type);
          break;
        }

        case "restore-client": {
          const { arguments } = parseTokens(tokens, {
            arguments: { id: "string" },
          });

          await restoreClient(arguments.id);
          break;
        }

        case "retrieve-clients": {
          const { flags } = parseTokens(tokens, {
            flags: {
              "--page": "number",
              "--limit": "number",
              "--deleted": "boolean",
            },
          });

          const status = flags["--deleted"]
            ? ClientStatus.DELETED
            : ClientStatus.ACTIVE;

          await retrieveClients(flags["--page"], flags["--limit"], status);
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
      if (error instanceof ValidationError || error instanceof NotExistError) {
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
