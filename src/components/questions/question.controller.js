const Question = require("../../models/question");
const Bookmark = require("../../models/bookmark");
const Answer = require("../../models/answer");
const logger = require("../../logs/logger");

// post a question
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

// question pagination
exports.questionPagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
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

// read the questions from database
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
// get a speific question by question id
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

// get a speific question by user id
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

// update perticular question
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

// delete perticular question
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
