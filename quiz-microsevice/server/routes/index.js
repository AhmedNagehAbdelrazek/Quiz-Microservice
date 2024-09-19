const { Router } = require("express");

const oauthRoutes = require("./oauth");
const apiRoutes = require("./api");

const { authenticate } = require("../middlewares");

const router = Router();

router.use("/oauth", oauthRoutes);
router.use("/api", authenticate, apiRoutes);

router.use((req, res) => {
  res.status(404).json({
    message: "Not found.",
  });
});

module.exports = router;
