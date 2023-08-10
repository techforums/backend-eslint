const express = require("express");

const bookmarkRoutes = express.Router();
const bookmarkController = require("./bookmark.controller");
const auth = require("../../middleware/auth");

bookmarkRoutes.post("/bookmark", auth.auth, bookmarkController.addBookmark);
bookmarkRoutes.get("/bookmark/:userId", auth.auth, bookmarkController.getBookmarkByUserId);
bookmarkRoutes.get("/managebookmark/:userId", auth.auth, bookmarkController.getmanageBookmarkById);
module.exports = bookmarkRoutes;
