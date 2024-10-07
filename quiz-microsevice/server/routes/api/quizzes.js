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

router.post("/:quizId/restore", quizController.restoreQuiz);

router
  .route("/:quizId/questions")
  .post(quizController.createQuizQuestion)
  .get(quizController.retrieveQuizQuestions);

router
  .route("/:quizId/questions/:questionId")
  .patch(quizController.updateQuizQuestion)
  .delete(quizController.deleteQuizQuestion);

router.post(
  "/:quizId/questions/:questionId/restore",
  quizController.restoreQuizQuestion
);

module.exports = router;
