const logger = require("../../logs/logger");
const Question = require("../../models/question");

// search question
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
