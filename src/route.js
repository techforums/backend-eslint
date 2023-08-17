const express = require("express");

const route = express();

const signinRoutes = require("./components/auth/signin/signin.routes");
const bookmarkRoutes = require("./components/bookmark/bookmark.routes");
const signupRoutes = require("./components/auth/signup/signup.routes");
const signoutRoutes = require("./components/auth/signout/signout.routes");
const forgotpasswordRoutes = require("./components/auth/forgotpassword/forgotpassword.routes");
const serchRoutes = require("./components/search/search.routes");
const questionRoutes = require("./components/questions/question.routes");
const blogRoutes = require("./components/blog/blog.route");
const documentRoutes = require("./components/document/doc.route");
const answerRoutes = require("./components/answer/answer.route");
const manageUsersRoutes = require("./components/admin/manageUsers/manageUsers.routes");
const tagsRoutes = require("./components/admin/predefinedTags/tags.routes");
const manageResourcesRoutes = require("./components/admin/manageResources/manageResources.routes");

route.use("/", signupRoutes);

route.use("/forgotpassword", forgotpasswordRoutes);

route.use(
    "/users",
    signoutRoutes,
    signinRoutes,
    bookmarkRoutes,
    questionRoutes,
    serchRoutes,
    blogRoutes,
    documentRoutes,
    answerRoutes,
    tagsRoutes,
);

route.use("/admin", manageUsersRoutes, tagsRoutes, manageResourcesRoutes);

module.exports = route;
