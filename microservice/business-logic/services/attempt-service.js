const {
    attemptRepository, 
    quizRepository,
    questionRepository,
} = require("../../data-access/repositories");

const validator = require("validator");

const { AttemptStatus } = require("../enums");

const {
    ValidationError,
    NotExistError,
    InvalidStatusError,
} = require("../errors/common");


const { getModels } = require("../../data-access/models");

const validateId = (id, message = "Invalid ID, it must be a UUID.") => {
    if (!validator.isUUID(id)) {
        throw new ValidationError(message);
    }
};


const retrieveAttemptAnalysis = async (clientId, userId, attemptId) => {
    validateId(userId, "Invalid user ID, it must be a UUID.");
    validateId(attemptId, "Invalid attempt ID, it must be a UUID.");

    const attempt = await attemptRepository.retrieveAttemptById(clientId, attemptId);

    if (!attempt) {
        throw new NotExistError("Attempt not found.");
    }

    if (attempt.userId !== userId) {
        throw new ValidationError("Unauthorized access to this attempt.");
    }

    const quiz = await quizRepository.retrieveQuiz(clientId, attempt.quizId);
    const { Response } = getModels(clientId);
    const responses = await Response.find({ _id: { $in: attempt.responses } }).lean();
    
    const totalQuestions = quiz.questions.length;

    const answeredQuestions = responses.length;
    const correctAnswers = responses.filter(response => response.score > 0).length;
    const incorrectAnswers = responses.filter(Response => Response.score === 0).length;
    const unansweredQuestions = totalQuestions - answeredQuestions;
    const timeTaken = Math.floor((new Date(attempt.submittedAt) - new Date(attempt.startedAt)) / 1000); 
    const score = responses.reduce((total, response) => total + (response.score > 0 ? response.score : 0), 0);

    return {
        answeredQuestions,
        unansweredQuestions,
        correctAnswers,
        incorrectAnswers,
        timeTaken,
        score,
    };
};



module.exports = {
    retrieveAttemptAnalysis,
};
