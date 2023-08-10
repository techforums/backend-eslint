const Question = require("../../models/question");
const Bookmark = require("../../models/bookmark");
const Answer = require("../../models/answer");

// post a question
exports.createQuestion = async (req, res) => {
  try {
    const { userId } = req.body;
    const { question } = req.body;
    const { questionDescribe } = req.body;
    const { tags } = req.body;
    if (Object.keys(req.body).length === 0) {
      return res.status(406).json({
        status: 406,
        message: "Data not Found, Payload Not Acceptable",
      });
    }
    if (req.body.question === undefined) {
      return res
        .status(400)
        .json({ status: 400, message: "please enter the question" });
    }
    if (req.body.questionDescribe === undefined) {
      return res
        .status(400)
        .json({ status: 400, message: "please enter the questionDescribe" });
    }
    if (!Array.isArray(tags)) {
      return res
        .status(406)
        .json({
          status: 406,
          message: "tags can't be empty and it must be in Array",
        });
    }
    const questionCreated = new Question({
      userId,
      question,
      tags,
      questionDescribe,
    });
    await questionCreated.save();
    return res.status(201).json({
      status: 201,
      message: "Question created successfully",
      data: questionCreated,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
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
        status: 404,
        message: "Data Not Found",
      });
    }
    return res.status(200).json({
      status: 200,
      message: "Questions Readed successfully",
      data: questionsData,
      nbHits: questionsData.length,
      totalPages,
      hasMore,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
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
        status: 404,
        message: "Data Not Found",
      });
    }
    return res.status(200).json({
      status: 200,
      message: "Questions Readed successfully",
      data: questionsData,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: "Server Error",
    });
  }
};
// get a speific question by question id
exports.readByIdQuestion = async (req, res) => {
  const { id } = req.params;
  if (id.length !== 24) {
    return res.status(400).json({
      status: 400,
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
        status: 404,
        message: "Data Not Found",
      });
    }
    return res.status(200).json({
      status: 200,
      message: "Question Readed successfully",
      data: questionData,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
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
        status: 404,
        message: "Data Not Found",
      });
    }
    return res.status(200).json({
      status: 200,
      message: "Question Readed successfully",
      data: questionData,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
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
      status: 400,
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
        status: 404,
        message: "Data Not Found",
      });
    }
    return res.status(200).json({
      status: 200,
      message: "Question Updated Successfully",
      data: updateQuestion,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: "Server Error",
    });
  }
};

// delete perticular question
exports.deleteQuestion = async (req, res) => {
  const { id } = req.params;
  if (id.length !== 24) {
    return res.status(400).json({
      status: 400,
      message: "Invalid question id",
    });
  }
  try {
    await Question.findByIdAndDelete(id);
    await Bookmark.deleteMany({ questionId: id });
    await Answer.deleteMany({ questionId: id });
    return res.status(200).json({
      status: 200,
      message: "Question Deleted Successfully",
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: "Server Error",
    });
  }
};
