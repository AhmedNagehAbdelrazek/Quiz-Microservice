const { Router } = require("express");

const { quizController } = require("../../controllers");

const router = Router();

router
  .route("/v1/quizzes")
  .post(quizController.createQuiz)
  .get(quizController.retrieveQuizzes);

router
  .route("/v1/quizzes/:quizId")
  .get(quizController.retrieveQuiz)
  .patch(quizController.updateQuiz);

router.post("/v1/quizzes/:quizId/publish", quizController.publishQuiz);

router.post("/v1/quizzes/:quizId/unpublish", quizController.unpublishQuiz);

router.post("/v1/quizzes/:quizId/archive", quizController.archiveQuiz);

router.post("/v1/quizzes/:quizId/unarchive", quizController.unarchiveQuiz);

router.post("/v1/quizzes/:quizId/questions", quizController.addQuestion);

router
  .route("/v1/quizzes/:quizId/questions/:questionId")
  .patch(quizController.updateQuestion)
  .delete(quizController.removeQuestion);

router.post(
  "/v1/users/:userId/quizzes/:quizId/start",
  quizController.startQuiz
);

router.post(
  "/v1/users/:userId/attempts/:attemptId/submit",
  quizController.submitQuiz);


module.exports = router;
