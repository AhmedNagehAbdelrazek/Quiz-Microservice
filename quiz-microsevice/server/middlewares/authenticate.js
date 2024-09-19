const { authService } = require("../../business-logic/services");
const {
  InvalidOrExpiredTokenError,
} = require("../../business-logic/errors/auth");

const authenticate = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({
      message: "Missing authorization header.",
    });
  }

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Missing token.",
    });
  }

  try {
    const client = await authService.authenticate(token);

    req.client = client;

    next();
  } catch (e) {
    let statusCode = 500;
    let message = "An unexpected error occurred on the server.";

    if (e instanceof InvalidOrExpiredTokenError) {
      statusCode = 401;
      message = e.message;
    }

    if (statusCode === 500) {
      console.error(e);
    }

    res.status(statusCode).json({
      message,
    });
  }
};

module.exports = authenticate;
