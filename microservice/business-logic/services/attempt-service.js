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


const submitQuiz = async (clientId, userId, attemptId, responses) => {
    validateId(userId, "Invalid user ID, it must be a UUID.");
    validateId(attemptId, "There is no attempt with this ID.");

    const attempt = await attemptRepository.retrieveAttemptById(clientId, attemptId);

    if (!attempt) {
        throw new NotExistError("There is no attempt with this ID.");
    }
    
    if (attempt.userId !== userId) {
        throw new ValidationError("Invalid or non-active attempt.");
    }

    if (attempt.status === AttemptStatus.SUBMITTED) {
        throw new InvalidStatusError("This attempt has already been submitted.");
    }

    const quiz = await quizRepository.retrieveQuiz(clientId, attempt.quizId);

    const invalidResponses = responses.filter(response => !quiz.questions.includes(response.questionId));

    if (invalidResponses.length > 0) {
        throw new ValidationError("Some questions are not part of this quiz.");
    }

    const { Response } = getModels(clientId);
    
    const responsesToSave = [];
    let totalScore = 0;

    for (const response of responses) {
        const question = await questionRepository.retrieveQuestion(clientId, response.questionId);

        let score = 0;
        if (response.answer === question.answer) {
            score = question.points; 
            totalScore += score;
        }

        const newResponse = new Response({
            question: response.questionId,
            answer: response.answer,
            score,
        });
        
        await newResponse.save();
        
        responsesToSave.push(newResponse);
    }

    await attemptRepository.updateAttempt(clientId, attemptId, {
        status: AttemptStatus.SUBMITTED,
        submittedAt: new Date(),
        responses: responsesToSave.map(resp => resp._id), 
        score: totalScore, 
    });

    const updatedAttempt = await attemptRepository.retrieveAttemptById(clientId, attemptId);

    const formattedResponse = {
            attempt: {
                id: updatedAttempt.id,
                quiz: {
                    id: quiz.id,
                    title: quiz.title,
                    description: quiz.description,
                    timeLimit: quiz.timeLimit,
                },
                startedAt: updatedAttempt.startedAt,
                submittedAt: updatedAttempt.submittedAt,
                status: updatedAttempt.status,
                responses: await Promise.all(responsesToSave.map(async (resp) => {
                    const question = await questionRepository.retrieveQuestion(clientId, resp.question);
                    return {
                        id: resp._id,
                        question: {
                            id: question.id,
                            type: question.type,
                            text: question.text,
                            options: question.options,
                            points: question.points,
                        },
                        answer: resp.answer,
                        score: resp.score,
                    };
                })),
            },
        }
    
    return formattedResponse;
};



module.exports = {
    submitQuiz,
};
