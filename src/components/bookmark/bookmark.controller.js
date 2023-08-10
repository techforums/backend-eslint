const Bookmark = require("../../models/bookmark");

module.exports = {
  addBookmark: async (req, res) => {
    try {
      const userId = await req.body.userId;
      const { questionId } = req.body;
      const addedBookmark = await Bookmark.findOne({ userId, questionId });
      if (addedBookmark) {
        await Bookmark.findByIdAndDelete(addedBookmark._id);
        res.status(200).json({
          status: 200,
          message: "Bookmark removed",
        });
      } else {
        const bookmark = new Bookmark({ userId, questionId });
        await bookmark.save();
        return res.status(201).json({
          status: 201,
          message: "Added bookmark",
          data: bookmark,
        });
      }
    } catch (err) {
      return res.status(500).json({
        status: 500,
        message: "Server Error",
      });
    }
  },

  getmanageBookmarkById: async (req, res) => {
    try {
      const { userId } = req.params;
      const bookmarks = await Bookmark.find({ userId }).populate([
        {
          path: "questionId",
          populate: {
            path: "userId",
            model: "user",
          },
        },
      ]);
      res.status(200).json({
        status: 200,
        message: "Bookmarks",
        data: bookmarks,
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        message: "Server Error",
      });
    }
  },

  getBookmarkByUserId: async (req, res) => {
    const { userId } = req.params;
    if (userId.length !== 24) {
      return res.status(400).json({
        status: 400,
        message: "Invalid user id",
      });
    }
    try {
      const bookmarks = await Bookmark.find({ userId });
      res.status(200).json({
        status: 200,
        message: "Bookmarks",
        data: bookmarks,
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        message: "Server Error",
      });
    }
  },
};
