const { Router } = require("express");

const router = Router();

const { quizController } = require("../../controllers");

router.post("/", quizController.createQuiz);
router.get("/", quizController.retrieveQuizzes);

module.exports = router;
