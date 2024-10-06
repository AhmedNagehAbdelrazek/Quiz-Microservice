const { HttpError } = require("../errors");
const authErrors = require("../../business-logic/errors/auth");
const quizErrors = require("../../business-logic/errors/quiz");
const commonErrors = require("../../business-logic/errors/common");

const errorCodes = {
  400: [commonErrors.ValidationError, quizErrors.InvalidQuizStatusError],
  401: [authErrors.InvalidOrExpiredTokenError],
  404: [commonErrors.NotExistError],
};

const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  const statusCode = Object.keys(errorCodes).find((errorCode) => {
    return errorCodes[errorCode].some((errorType) => err instanceof errorType);
  });

  if (statusCode) {
    return res.status(Number(statusCode)).json({
      success: false,
      message: err.message,
    });
  }

  console.error(err);

  res.status(500).json({
    success: false,
    message: "An unexpected error occurred on the server.",
  });
};

module.exports = errorHandler;
