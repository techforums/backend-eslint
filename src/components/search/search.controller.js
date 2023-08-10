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
      return res.status(404).json({
        status: 404,
        message: "Data Not Found",
      });
    }
    return res.status(200).json({
      status: 200,
      message: "Qustion searched Successfully",
      data: searchedData,
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Server Error",
      data: e,
    });
  }
};
