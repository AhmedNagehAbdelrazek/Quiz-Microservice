const { Router } = require("express");

const router = Router();

const { quizController } = require("../../controllers");

router
  .route("/")
  .post(quizController.createQuiz)
  .get(quizController.retrieveQuizzes);

router
  .route("/:quizId")
  .get(quizController.retrieveQuiz)
  .patch(quizController.updateQuiz);

router.route("/:quizId/publish").post(quizController.publishQuiz);

router.route("/:quizId/questions").post(quizController.addQuestionToQuiz);

router
  .route("/:quizId/questions/:questionId")
  .patch(quizController.updateQuestionInQuiz)
  .delete(quizController.removeQuestionFormQuiz);

module.exports = router;
