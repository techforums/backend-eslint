const Answer = require("../../models/answer");
const logger = require("../../logs/logger");

/**
 * creates an answer to that question
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body in the request.
 * @param {Object} res - The response object.
 * @returns {Object} - The HTTP response containing the status, message, and data of the fetched bookmarks.
 * @throws {Object} - The HTTP response indicating a server error if an exception occurs.
 */
exports.addAnswer = async (req, res) => {
    const { answer, userId, questionId } = req.body;
    const addanswer = new Answer({
        userId,
        questionId,
        answer,
    });
    try {
        Answer;
        await addanswer.save();
        logger.log("info", "Answer Posted successfully");
        return res.status(201).json({
            status: "Success",
            message: "Answer Posted successfully",
            data: addanswer,
        });
    } catch (err) {
        logger.log("error", err);
        return res.status(500).json({
            satus: "Fail",
            error: "Server Error",
        });
    }
};

/**
 * get answer to that question
 * @param {Object} req - The request object.
 * @param {Object} req.params - The path parameters in the request.
 * @param {string} req.params.questionId - The questionId in path parameters in the request.
 * @param {Object} res - The response object.
 * @returns {Object} - The HTTP response containing the status, message, and data of the fetched bookmarks.
 * @throws {Object} - The HTTP response indicating a server error if an exception occurs.
 */
exports.getAnswerByquestionId = async (req, res) => {
    try {
        const getanswer = await Answer.find({
            questionId: req.params.questionId,
        }).populate([
            {
                path: "userId",
            },
            {
                path: "questionId",
            },
        ]);
        return res.status(201).json({
            status: "Success",
            message: "Answer got successfully",
            data: getanswer,
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
 * edits the given specific answer
 * @param {Object} req - The request object.
 * @param {Object} req.params - The path parameters in the request.
 * @param {Object} res - The response object.
 * @returns {Object} - The HTTP response containing the status, message, and data of the fetched bookmarks.
 * @throws {Object} - The HTTP response indicating a server error if an exception occurs.
 */
exports.editAnswer = async (req, res) => {
    const { id } = req.params;
    if (id.length !== 24) {
        return res.status(400).json({
            status: "Fail",
            message: "Invalid answer id",
        });
    }
    try {
        const editanswer = await Answer.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        if (!editanswer) {
            return res.status(404).json({
                status: "Fail",
                message: "Answer not found",
            });
        }
        return res.status(201).json({
            status: "Success",
            message: "Answer Updated successfully",
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
 * deletes the given specific answer
 * @param {Object} req - The request object.
 * @param {Object} req.params - The path parameters in the request.
 * @param {string} req.params.id - The id in path parameters in the request.
 * @param {Object} res - The response object.
 * @returns {Object} - The HTTP response containing the status, message, and data of the fetched bookmarks.
 * @throws {Object} - The HTTP response indicating a server error if an exception occurs.
 */
exports.deleteAnswer = async (req, res) => {
    const _id = req.params.id;
    try {
        const deleteanswer = await Answer.findByIdAndDelete(_id);
        if (!deleteanswer) {
            return res.status(404).json({
                status: 404,
                message: "Answer already deleted!",
            });
        }
        return res.status(201).send({
            status: "Success",
            message: "Answer deleted successfully",
        });
    } catch (err) {
        logger.log("error", err);
        return res.status(500).json({
            satus: "Fail",
            message: "Server Error",
        });
    }
};

/**
 * post upvotes
 * @param {Object} req - The request object.
 * @param {Object} req.params - The path parameters in the request.
 * @param {string} req.params.id - The id in path parameters in the request.
 * @param {Object} req.body - The body in the request.
 * @param {string} req.body.upvotes - The upvotes in body of the request.
 * @param {Object} res - The response object.
 * @returns {Object} - The HTTP response containing the status, message, and data of the fetched bookmarks.
 * @throws {Object} - The HTTP response indicating a server error if an exception occurs.
 */
exports.Upvote = async (req, res) => {
    const answerId = req.params.id;
    const userId = req.body.upvotes;

    const vote = await Answer.findOne({ _id: answerId });
    if (vote.upvotes.includes(userId)) {
        const updatedVote = await Answer.updateOne(
            { _id: answerId },
            { $pull: { upvotes: userId } },
        );
        logger.log("info", updatedVote);
        res.status(201).json({
            message: "Upvote removed",
        });
    } else {
        const answer = await Answer.updateOne(
            { _id: answerId },
            { $addToSet: { upvotes: userId }, $pull: { downvotes: userId } },
        );
        res.status(201).json({
            message: "Upvoted Successfully",
            data: answer,
        });
    }
};

/**
 * post downvotes
 * @param {Object} req - The request object.
 * @param {Object} req.params - The path parameters in the request.
 * @param {string} req.params.id - The id in path parameters in the request.
 * @param {Object} req.body - The body in the request.
 * @param {string} req.body.downvotes - The downvotes in body of the request.
 * @param {Object} res - The response object.
 * @returns {Object} - The HTTP response containing the status, message, and data of the fetched bookmarks.
 * @throws {Object} - The HTTP response indicating a server error if an exception occurs.
 */
exports.Downvote = async (req, res) => {
    const answerId = req.params.id;
    const userId = req.body.downvotes;

    const vote = await Answer.findOne({ _id: answerId });
    if (vote.downvotes.includes(userId)) {
        const updatedVote = await Answer.updateOne(
            { _id: answerId },
            { $pull: { downvotes: userId } },
        );
        logger.log("info", updatedVote);
        res.status(201).json({
            message: "Downvote removed",
        });
    } else {
        await Answer.updateOne(
            { _id: answerId },
            { $addToSet: { downvotes: userId }, $pull: { upvotes: userId } },
        );
        res.status(201).json({
            message: "Downvoted Successfully",
        });
    }
};
