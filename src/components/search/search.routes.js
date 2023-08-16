const express = require("express");

const searchRouter = new express.Router();
const searchController = require("./search.controller");
const validator = require("../../middleware/validator");

searchRouter.get("/search", validator.searchValidation(), searchController.searchQuestion);

module.exports = searchRouter;
