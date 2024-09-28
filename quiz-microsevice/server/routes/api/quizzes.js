const { Router } = require("express");

const router = Router();

const { quizController } = require("../../controllers");

router.post("/", quizController.createQuiz);

module.exports = router;
