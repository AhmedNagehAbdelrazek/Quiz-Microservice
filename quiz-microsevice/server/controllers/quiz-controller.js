const { quizService } = require("../../business-logic/services");
const { ValidationError } = require("../../business-logic/errors/common");

const createQuiz = async (req, res) => {
  const client = req.client;
  const {
    title,
    description,
    categories,
    difficulty,
    timeLimit,
    attemptLimit,
    dueDate,
    passingScore,
    isPublished,
    questions,
  } = req.body;
  try {
    const quiz = await quizService.createQuiz(
      client,
      title,
      description,
      categories,
      difficulty,
      timeLimit,
      attemptLimit,
      dueDate,
      passingScore,
      isPublished,
      questions
    );

    res.status(201).json({
      success: true,
      data: {
        quiz,
      },
    });
  } catch (e) {
    let statusCode = 500;
    let message = "An unexpected error occurred on the server.";

    if (e instanceof ValidationError) {
      statusCode = 400;
      message = e.message;
    }

    if (statusCode === 500) {
      console.error(e);
    }

    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

const retrieveQuizzes = async (req, res) => {
  try {

    const client = req.client;
    const quizzes = await quizService.retrieveQuizzes(client.id)
    
    return res.status(200).json({
      success: true, 
      quizzes: quizzes
    });


  }catch (e) {
    let statusCode = 500;
    let message = "An unexpected error occurred on the server.";

    if (e instanceof ValidationError) {
      statusCode = 400;
      message = e.message;
    }

    if (statusCode === 500) {
      console.error(e);
    }

    res.status(statusCode).json({
      success: false,
      message,
    });
  }
}

module.exports = { createQuiz, retrieveQuizzes};
