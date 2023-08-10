const express = require("express");

const documentRoutes = express.Router();
const auth = require("../../middleware/auth");
const multer = require("../../middleware/multer");
const documentController = require("./doc.controller");

documentRoutes.get("/document", auth.auth, documentController.getDocument);

documentRoutes.get("/document/:id", auth.auth, documentController.getDocuments);

documentRoutes.post("/document", multer, auth.auth, documentController.postDocument);

documentRoutes.delete("/document/:id", auth.auth, documentController.deleteDocument);

documentRoutes.get("/documentbyuser/:userId", auth.auth, documentController.getDocumentuser);

module.exports = documentRoutes;
