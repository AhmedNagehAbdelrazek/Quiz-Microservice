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

router.post("/:quizId/publish", quizController.publishQuiz);

router.post("/:quizId/unpublish", quizController.unpublishQuiz);

router.post("/:quizId/archive", quizController.archiveQuiz);

router.post("/:quizId/unarchive", quizController.unarchiveQuiz);

router.delete("/:quizId/delete", quizController.deletedQuiz);

router.post("/:quizId/restore", quizController.restoreQuiz);

router.delete(
  "/:quizId/permanently-delete",
  quizController.permanentlyDeleteQuiz
);

router.post("/:quizId/questions", quizController.addQuestionToQuiz);

router
  .route("/:quizId/questions/:questionId")
  .patch(quizController.updateQuestionInQuiz)
  .delete(quizController.removeQuestionFormQuiz);

module.exports = router;
