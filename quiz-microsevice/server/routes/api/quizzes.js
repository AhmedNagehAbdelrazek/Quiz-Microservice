const { Router } = require("express");

const router = Router();

const { quizController } = require("../../controllers");

router.post("/", quizController.createQuiz);
router.get("/:quizId", quizController.retrieveSpecificQuiz);

module.exports = router;
