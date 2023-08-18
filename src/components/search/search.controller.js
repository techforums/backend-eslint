const logger = require("../../logs/logger");
const Question = require("../../models/question");

/**
 * Search for questions based on specified tags.
 *
 * @param {Object} req - The request object.
 * @param {string} req.query.tags - The tags to search for in questions.
 * @param {Object} res - The response object.
 * @returns {Object} - The HTTP response containing the searched questions.
 * @throws {Object} - The HTTP response indicating a server error if an exception occurs.
 */
exports.searchQuestion = async (req, res) => {
    try {
        const question = req.query.tags;
        const searchedData = await Question.aggregate([
            {
                $search: {
                    index: "search-question",
                    text: {
                        query: question,
                        path: "question",
                    },
                },
            },
        ]);

        if (!searchedData) {
            logger.error("No Data Found");
            return res.status(404).json({
                status: "Fail",
                message: "Data Not Found",
            });
        }
        logger.log("info", "Question searched Successfully!!");
        return res.status(200).json({
            status: "Success",
            message: "Qustion searched Successfully!!",
            data: searchedData,
        });
    } catch (e) {
        return res.status(500).json({
            status: "Fail",
            message: "Server Error",
            data: e,
        });
    }
};
