const validator = require("validator");

const { QuestionsTypes } = require("../enums");
const { ValidationError, NotExistError} = require("../errors/common");


const { questionRepository } = require("../../data-access/repositories");

const validatId = (id, message = "Invalid id. It must be a valid MongoId.") => {
  if (!validator.isMongoId(id)) {
    throw new ValidationError(message);
  }
};

const validateType = (type) => {
  if (!Object.values(QuestionsTypes).includes(type)) {
    throw new ValidationError("Invalid type.");
  }
};

const validateText = (text) => {
  if (typeof text !== "string") {
    throw new ValidationError("Invalid text, It must be  string.");
  }

  if (!validator.isLength(text, { min: 1, max: 1024 })) {
    throw new ValidationError(
      "Invalid text, It must be between 1 and 1024 characters."
    );
  }
};

const validateOptions = (type, options) => {
  if (type === QuestionsTypes.MILTIPLE_CHOICE) {
    if (
      !Array.isArray(options) ||
      !options.every((option) => typeof option === "string")
    ) {
      throw new ValidationError(
        "Invalid options, It must be an array of strings for Multiple-Choice questions."
      );
    }
  }

  if (options !== null) {
    throw new ValidationError(
      "Invalid options, It must be null for question types other than Multiple-Choice."
    );
  }
};

const validateAnswer = (type, options, answer) => {
  if (type === QuestionsTypes.MULTIPLE_CHOICE && !options.includes(answer)) {
    throw new ValidationError(
      "Invalid answer, it must be one of the provided options."
    );
  }

  if (
    type === QuestionsTypes.TRUE_FALSE &&
    !["true", "false"].includes(answer)
  ) {
    throw new ValidationError(
      "Invalid answer, it must be either 'true' or 'false'."
    );
  }

  if (typeof answer !== "string") {
    throw new ValidationError("Invalid answer, it must be a string.");
  }

  if (!validator.isLength(answer, { min: 1, max: 1024 })) {
    throw new ValidationError(
      "Invalid answer, it must be between 1 and 1024 characters."
    );
  }
};

const validatePoints = (points) => {
  if (!validator.isInt(String(points), { min: 0, max: 100 })) {
    throw new ValidationError(
      "Invalid points, It must be a number between 0 and 100."
    );
  }
};

const createQuestion = async (
  clientId,
  quizId,
  type,
  text,
  options,
  answer,
  points
) => {
  validatId(clientId, "Invalid clientId, It must be a valid MongoId.");
  validateType(type);
  validateText(text);
  validateOptions(type, options);
  validateAnswer(type, options, answer);
  validatePoints(points);
  
  const question = await questionRepository.createQuestion(
    clientId,
    quizId,
    type,
    text,
    options,
    answer,
    points
  );
  
  return question;
};

const deleteQuestion = async (clientId, questionId) => {
  validatId(clientId, "Invalid clientId, It must be a valid MongoId.");
  
  await questionRepository.deleteQuestion(clientId, questionId);
};

const retrieveQuestionsForQuiz = (clientId, quizId) => {
  validatId(clientId, "Invalid clientId, It must be a valid MongoId.");
  
  return questionRepository.retrieveQuestionsForQuiz(clientId, quizId);
};

const deleteQuestionsForQuiz = async (clientId, quizId) => {
  validatId(clientId, "Invalid clientId, It must be a valid MongoId.");
  
  await questionRepository.deleteQuestionsForQuiz(clientId, quizId);
};

const deleteOneQuestionsForQuiz = async (clientId, questionId) => {
  validatId(clientId, "Invalid clientId, It must be a valid MongoId.");
  // validatId(questionId, "Invalid clientId, It must be a valid MongoId.");
  
  await questionRepository.deleteOneQuestionForQuiz(clientId, questionId);
};


const updateQuestion = async (clientId, questionId, updates) => {
  validatId(clientId, "Invalid clientId, It must be a valid MongoId.");
  validatId(questionId, "Invalid questionId, It must be a valid MongoId.");

  if (updates.type) validateType(updates.type);
  if (updates.text) validateText(updates.text);
  if (updates.options) validateOptions(updates.type, updates.options);
  if (updates.answer) validateAnswer(updates.type, updates.options, updates.answer);
  if (updates.points !== undefined) validatePoints(updates.points);

  const updatedQuestion = await questionRepository.updateQuestion(
    clientId,
    questionId,
    updates
  );

  // if (!updatedQuestion) {
  //   throw new NotExistError("");
  // }

  return updatedQuestion;
};

module.exports = {
  createQuestion,
  deleteQuestion,
  retrieveQuestionsForQuiz,
  deleteQuestionsForQuiz,
  deleteOneQuestionsForQuiz,
  updateQuestion,
};
