const { Router } = require("express");

const router = Router();

const { quizController } = require("../../controllers");

router
  .route("/")
  .post(quizController.createQuiz)
  .get(quizController.retrieveQuizzes);

router.route("/:quizId").get(quizController.retrieveQuiz);

router.route("/:quizId/publish").post(quizController.publishQuiz);

router.route("/:quizId/questions").post(quizController.addQuestionToQuiz);

router.route("/:quizId/questions").post(quizController.addQuestionToQuiz);

router.route("/questions/:questionId").delete(quizController.deleteOneQuestionForQuiz);

router.route("/questions/:questionId").put(quizController.updateQuestion);

module.exports = router;
