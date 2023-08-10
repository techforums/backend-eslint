const express = require("express");

const blogRoutes = express.Router();
const auth = require("../../middleware/auth");
const blogController = require("./blog.controller");

blogRoutes.get("/blog", auth.auth, blogController.blogs);

blogRoutes.get("/blog/:id", auth.auth, blogController.blog);

blogRoutes.get("/blogbyuser/:userId", auth.auth, blogController.getBlog);

blogRoutes.post("/blog", auth.auth, blogController.createBlog);

blogRoutes.delete("/blog/:id", auth.auth, blogController.deleteBlog);

blogRoutes.patch("/blog/:id", auth.auth, blogController.updateBlog);

blogRoutes.get("/blogtitle", blogController.getBlogTitle);

module.exports = blogRoutes;
