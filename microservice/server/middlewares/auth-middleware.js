const asyncHandler = require("express-async-handler");

const { HttpError } = require("../errors");
const { authService } = require("../../business-logic/services");

const authMiddleware = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    throw new HttpError(400, "Missing authorization header.");
  }

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    throw new HttpError(400, "Missing token.");
  }

  const client = await authService.authenticateClientByAccessToken(token);

  req.client = client;

  next();
});

module.exports = authMiddleware;
