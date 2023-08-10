const express = require("express");

const TagsRoutes = express.Router();
const TagsController = require("./tags.controller");
const tagsController = require("./tags.controller");

TagsRoutes.post("/addTag", TagsController.addTag);
TagsRoutes.get("/getalltags", tagsController.getAllTags);
TagsRoutes.delete("/deletetag/:id", TagsController.deleteTag);

module.exports = TagsRoutes;
