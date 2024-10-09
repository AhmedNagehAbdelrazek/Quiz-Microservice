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
  .patch(quizController.updateQuiz)
  .delete(quizController.deletedQuiz);

router.post("/:quizId/publish", quizController.publishQuiz);

router.post("/:quizId/unpublish", quizController.unpublishQuiz);

router.post("/:quizId/archive", quizController.archiveQuiz);

router.post("/:quizId/unarchive", quizController.unarchiveQuiz);

router.post("/:quizId/questions", quizController.createQuestion);

router
  .route("/:quizId/questions/:questionId")
  .patch(quizController.updateQuestion)
  .delete(quizController.deleteQuestion);

module.exports = router;
