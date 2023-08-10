const Answer = require("../../models/answer");

// creates an answer to that question
exports.addAnswer = async (req, res) => {
  const { answer, userId, questionId } = req.body;
  if (Object.keys(req.body).length === 0) {
    return res.status(406).json({
      status: 406,
      message: "Data not Found, Payload Not Acceptable",
    });
  }
  if (answer === undefined) {
    return res
      .status(400)
      .json({ status: 400, message: "please enter the answer" });
  }
  if (userId === undefined) {
    return res
      .status(400)
      .json({ status: 400, message: "please enter the userId" });
  }
  if (questionId === undefined) {
    return res
      .status(400)
      .json({ status: 400, message: "please enter the questionId" });
  }
  const addanswer = new Answer({
    userId,
    questionId,
    answer,
  });
  try {
    Answer;
    await addanswer.save();
    return res.status(201).json({
      status: 201,
      message: "Answer Posted successfully",
      data: addanswer,
    });
  } catch (err) {
    return res.status(500).json({
      satus: 500,
      error: "Server Error",
    });
  }
};

// get answer to that question
exports.getAnswerByquestionId = async (req, res) => {
  try {
    const getanswer = await Answer.find({
      questionId: req.params.questionId,
    }).populate([
      {
        path: "userId",
      }, {
        path: "questionId",
      },
    ]);
    res.status(201).json({
      status: 201,
      message: "Answer get successfully",
      data: getanswer,
    });
    if (questionId.length !== 24) {
      return res.status(400).json({
        status: 400,
        message: "Invalid question id",
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: "Server Error",
    });
  }
};

// edits the given specific answer
exports.editAnswer = async (req, res) => {
  const { id } = req.params;
  if (id.length !== 24) {
    return res.status(400).json({
      status: 400,
      message: "Invalid answer id",
    });
  }
  try {
    const editanswer = await Answer.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!editanswer) {
      res.status(404).json({
        status: 404,
        message: "Answer not found",
      });
    } else {
      res.status(201).json({
        status: 201,
        message: "Answer Updated successfully",
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: "Server Error",
    });
  }
};

// deletes the given specific answer
exports.deleteAnswer = async (req, res) => {
  const _id = req.params.id;
  if (id.length !== 24) {
    return res.status(400).json({
      status: 400,
      message: "Invalid answer id",
    });
  }
  try {
    const deleteanswer = await Answer.findByIdAndDelete(_id);
    if (!deleteanswer) {
      res.status(404).json({
        status: 404,
        message: "Answer already deleted!",
      });
    } else {
      res.status(201).send({
        status: 201,
        message: "Answer deleted successfully",
      });
    }
  } catch (err) {
    return res.status(500).json({
      satus: 500,
      message: "Server Error",
    });
  }
};

// post upvotes

exports.Upvote = async (req, res) => {
  const answerId = req.params.id;
  const userId = req.body.upvotes;

  const vote = await Answer.findOne({ _id: answerId });
  if (vote.upvotes.includes(userId)) {
    const updatedVote = await Answer.updateOne(
      { _id: answerId },
      { $pull: { upvotes: userId } },
    );
    res.status(201).json({
      message: "Upvote removed",
    });
  } else {
    const answer = await Answer.updateOne({ _id: answerId }, { $addToSet: { upvotes: userId }, $pull: { downvotes: userId } });
    res.status(201).json({
      message: "Upvoted Successfully",
    });
  }
};

// post downvotes

exports.Downvote = async (req, res) => {
  const answerId = req.params.id;
  const userId = req.body.downvotes;

  const vote = await Answer.findOne({ _id: answerId });
  if (vote.downvotes.includes(userId)) {
    const updatedVote = await Answer.updateOne(
      { _id: answerId },
      { $pull: { downvotes: userId } },
    );
    res.status(201).json({
      message: "Downvote removed",
    });
  } else {
    await Answer.updateOne({ _id: answerId }, { $addToSet: { downvotes: userId }, $pull: { upvotes: userId } });
    res.status(201).json({
      message: "Downvoted Successfully",
    });
  }
};

// total upvotes
exports.checkup = async (req, res) => {
  try {
    const answer = await Answer.find({ _id: req.params.id });
    const totalupvote = vote.upvotesLength;
    if (!vote) {
      res.status(404).send();
    } else {
      res.status(201).json({
        message: "success",
        data: totalupvote,
      });
    }
  } catch (err) {
    return res.status(500).json({
      satus: 500,
      message: "Server Error",
      data: err,
    });
  }
};

// total downvotes
exports.checkdown = async (req, res) => {
  try {
    const vote = await Answer.findById(req.params.id);
    const totaldownvote = vote.downvotesLength;
    if (!vote) {
      res.status(404).send();
    } else {
      res.status(201).json({
        message: "Success",
        data: totaldownvote,
      });
    }
  } catch (err) {
    return res.status(500).json({
      satus: 500,
      message: "Server Error",
    });
  }
};
