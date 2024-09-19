const { Router } = require("express");

const { oauthController } = require("../../controllers");

const router = Router();

router.post("/token", oauthController.generateToken);

module.exports = router;
