const { Router } = require("express");

const { oauthController } = require("../../controllers");
const { oauthErrorHandler } = require("../../handlers");

const router = Router();

router.post("/token", oauthController.generateAccessToken);

router.use(oauthErrorHandler);

module.exports = router;
