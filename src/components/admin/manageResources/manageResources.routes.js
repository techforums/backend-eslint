const express = require("express");

const manageResourcesRoutes = express.Router();
const manageResourcesController = require("./manageResources.controller");

manageResourcesRoutes.patch(
    "/approveblog/:id",
    manageResourcesController.approveBlog,
);
manageResourcesRoutes.patch(
    "/approvedoc/:id",
    manageResourcesController.approveDocument,
);

manageResourcesRoutes.get("/blog", manageResourcesController.blogs);

manageResourcesRoutes.get("/document", manageResourcesController.getDocument);

module.exports = manageResourcesRoutes;
