#!/usr/bin/env node
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

const { createServer } = require("http");

const routes = require("./routes");

const app = express();

app.use(cors());
app.use(morgan("combined"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

const server = createServer(app);

const { PORT, MONGO_URI } = process.env;

const bootstrap = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    server.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  } catch (e) {
    console.error(e);

    process.exit(1);
  }
};

bootstrap();
