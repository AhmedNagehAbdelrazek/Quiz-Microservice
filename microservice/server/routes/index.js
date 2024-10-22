const { Router } = require("express");

const oauthRoutes = require("./oauth");
const apiRoutes = require("./api");

const { authMiddleware } = require("../middlewares");
const { HttpError } = require("../errors");

const router = Router();

router.use("/oauth", oauthRoutes);
router.use("/api", authMiddleware, apiRoutes);

router.use((req, res) => {
  throw new HttpError(
    404,
    `The requested endpoint '${req.originalUrl}' was not found.`
  );
});

// Error Handling

const authErrors = require("../../business-logic/errors/auth");
const commonErrors = require("../../business-logic/errors/common");
const attemptError = require("../../business-logic/errors/attempt");

const errorCodes = {
  400: [
    commonErrors.ValidationError,
    commonErrors.InvalidStatusError,
    attemptError.AttemptLimitError,
    attemptError.ActiveAttemptError,
  ],
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

router.use(errorHandler);

module.exports = router;
