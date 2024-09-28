const { Router } = require("express");

const router = Router();

const { quizController } = require("../../controllers");

router
  .route("/")
  .post(quizController.createQuiz)
  .get(quizController.retrieveQuizzes);

router.route("/:quizId").get(quizController.retrieveQuiz);

router.route("/:quizId/publish").post(quizController.publishQuiz);

module.exports = router;
