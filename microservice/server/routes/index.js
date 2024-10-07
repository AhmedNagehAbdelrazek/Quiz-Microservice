const { Router } = require("express");

const oauthRoutes = require("./oauth");
const apiRoutes = require("./api");

const { authMiddleware } = require("../middlewares");
const { HttpError } = require("../errors");
const { errorHandler } = require("../handlers");

const router = Router();

router.use("/oauth", oauthRoutes);
router.use("/api", authMiddleware, apiRoutes);

router.use((req, res) => {
  throw new HttpError(
    404,
    `The requested endpoint '${req.originalUrl}' was not found.`
  );
});

router.use(errorHandler);

module.exports = router;
