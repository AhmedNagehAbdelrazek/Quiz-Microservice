const { Router } = require("express");

const router = Router();

const quizzesRoutes = require("./quizzes");

router.use("/v1/quizzes", quizzesRoutes);

module.exports = router;
