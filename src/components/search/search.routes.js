const express = require("express");

const searchRouter = new express.Router();
const searchController = require("./search.controller");

searchRouter.get("/search", searchController.searchQuestion);

module.exports = searchRouter;
