const Question = require("../../models/question");
const Bookmark = require("../../models/bookmark");
const Answer = require("../../models/answer");
const logger = require("../../logs/logger");

/**
 * Create a new question.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body in the request.
 * @param {string} req.body.userId - The ID of the user creating the question.
 * @param {string} req.body.question - The question content.
 * @param {string} req.body.questionDescribe - Description of the question.
 * @param {string[]} req.body.tags - Tags associated with the question.
 * @param {Object} res - The response object.
 * @returns {Object} - The HTTP response indicating the status and outcome of the question creation.
 * @throws {Object} - The HTTP response indicating a server error if an exception occurs.
 */
exports.createQuestion = async (req, res) => {
    try {
        const { userId } = req.body;
        const { question } = req.body;
        const { questionDescribe } = req.body;
        const { tags } = req.body;
        const questionCreated = new Question({
            userId,
            question,
            tags,
            questionDescribe,
        });
        await questionCreated.save();
        logger.log("info", "Question created successfully");
        return res.status(201).json({
            status: "Success",
            message: "Question created successfully",
            data: questionCreated,
        });
    } catch (err) {
        logger.log("error", err);
        return res.status(500).json({
            status: "Fail",
            message: "Server Error",
            data: err,
        });
    }
};

/**
 * Get a paginated list of questions.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.query - The query parameters in the request.
 * @param {number} req.query.page - The page number for pagination (default: 1).
 * @param {number} req.query.limit - The number of questions per page (default: 8).
 * @param {Object} res - The response object.
 * @returns {Object} - The HTTP response containing the list of questions.
 * @throws {Object} - The HTTP response indicating a server error if an exception occurs.
 */
exports.questionPagination = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 8;
        const skip = (page - 1) * limit;

        const questionsData = await Question.find()
            .skip(skip)
            .limit(limit)
            .populate([
                {
                    path: "userId",
                },
            ]);
        const count = await Question.countDocuments();
        const totalPages = Math.ceil(count / limit);
        const hasMore = page < totalPages;

        if (!questionsData) {
            return res.status(404).json({
                status: "Fail",
                message: "Data Not Found",
            });
        }
        logger.info("response is : ", res);
        return res.status(200).json({
            status: "Success",
            message: "Questions Readed successfully",
            data: questionsData,
            nbHits: questionsData.length,
            totalPages,
            hasMore,
        });
    } catch (err) {
        return res.status(500).json({
            status: "Fail",
            message: "Server Error",
        });
    }
};

/**
 * Get all questions.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The HTTP response containing the list of questions.
 * @throws {Object} - The HTTP response indicating a server error if an exception occurs.
 */
exports.readQuestions = async (req, res) => {
    try {
        const questionsData = await Question.find().populate([
            {
                path: "userId",
            },
        ]);
        if (!questionsData) {
            return res.status(404).json({
                status: "Fail",
                message: "Data Not Found",
            });
        }
        logger.log("info", "Questions Read successfully");
        return res.status(200).json({
            status: "Success",
            message: "Questions Read successfully",
            data: questionsData,
        });
    } catch (err) {
        logger.log("error", err);
        return res.status(500).json({
            status: "Fail",
            message: "Server Error",
        });
    }
};

/**
 * Get a specific question by its ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The path parameters in the request.
 * @param {string} req.params.id - The ID of the question.
 * @param {Object} res - The response object.
 * @returns {Object} - The HTTP response containing the requested question.
 * @throws {Object} - The HTTP response indicating a server
 *
 */
exports.readByIdQuestion = async (req, res) => {
    const { id } = req.params;
    if (id.length !== 24) {
        return res.status(400).json({
            status: "Fail",
            message: "Invalid question id",
        });
    }
    try {
        const questionData = await Question.findById({ _id: id }).populate([
            {
                path: "userId",
            },
        ]);
        if (!questionData) {
            return res.status(404).json({
                status: "Fail",
                message: "Data Not Found",
            });
        }
        logger.log("info", "Question Read Successfully");
        return res.status(200).json({
            status: "Success",
            message: "Question Read successfully",
            data: questionData,
        });
    } catch (err) {
        logger.log("error", err);
        return res.status(500).json({
            status: "Fail",
            message: "Server Error",
            data: err,
        });
    }
};

/**
 * Get questions by user ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The path parameters in the request.
 * @param {string} req.params.userId - The ID of the user whose questions are being fetched.
 * @param {Object} res - The response object.
 * @returns {Object} - The HTTP response containing the list of questions.
 * @throws {Object} - The HTTP response indicating a server error if an exception occurs.
 */
exports.readByIdUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const questionData = await Question.find({ userId }).populate([
            {
                path: "userId",
            },
        ]);
        if (!questionData) {
            return res.status(404).json({
                status: "Fail",
                message: "Data Not Found",
            });
        }
        logger.log("info", "Question Read Successfully");
        return res.status(200).json({
            status: "Success",
            message: "Question Read successfully",
            data: questionData,
        });
    } catch (err) {
        logger.log("error", err);
        return res.status(500).json({
            status: "Fail",
            message: "Server Error",
            data: err,
        });
    }
};

/**
 * Update a specific question by its ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The params parameters in the request.
 * @param {string} req.params.id - The ID of the question to be updated.
 * @param {Object} req.body - The updated data for the question.
 * @param {Object} res - The response object.
 * @returns {Object} - The HTTP response indicating the status and outcome of the question update operation.
 * @throws {Object} - The HTTP response indicating a server error if an exception occurs.
 */
exports.updateQuestion = async (req, res) => {
    const { id } = req.params;
    if (id.length !== 24) {
        return res.status(400).json({
            status: "Fail",
            message: "Invalid question id",
        });
    }
    try {
        const update = req.body;
        const updateQuestion = await Question.findByIdAndUpdate(id, update, {
            new: true,
        });
        if (!updateQuestion) {
            return res.status(404).json({
                status: "Fail",
                message: "Data Not Found",
            });
        }

        logger.log("info", "Question Updated Successfully");
        return res.status(200).json({
            status: "Success",
            message: "Question Updated Successfully",
            data: updateQuestion,
        });
    } catch (err) {
        logger.log("error", err);
        return res.status(500).json({
            status: "Fail",
            message: "Server Error",
        });
    }
};

/**
 * Delete a specific question by its ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The params parameters in the request.
 * @param {string} req.params.id - The ID of the question to be deleted.
 * @param {Object} res - The response object.
 * @returns {Object} - The HTTP response indicating the status and outcome of the question deletion operation.
 * @throws {Object} - The HTTP response indicating a server error if an exception occurs.
 */
exports.deleteQuestion = async (req, res) => {
    const { id } = req.params;
    if (id.length !== 24) {
        return res.status(400).json({
            status: "Fail",
            message: "Invalid question id",
        });
    }
    try {
        await Question.findByIdAndDelete(id);
        await Bookmark.deleteMany({ questionId: id });
        await Answer.deleteMany({ questionId: id });
        logger.log("info", "Question Deleted Successfully");
        return res.status(200).json({
            status: "Success",
            message: "Question Deleted Successfully",
        });
    } catch (err) {
        logger.log("error", err);
        return res.status(500).json({
            status: "Fail",
            message: "Server Error",
        });
    }
};
