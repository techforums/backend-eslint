const Blog = require("../../models/blog");
const logger = require("../../logs/logger");
/**
 * Get a paginated list of approved blogs.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.query - The query parameters in the request.
 * @param {number} req.query.pageNumber - The page number for pagination (default: 1).
 * @param {number} req.query.pageSize - The number of blogs per page (default: 8).
 *
 * @param {Object} res - The response object.
 * @returns {Object} - The HTTP response containing the status, message, and data.
 * @throws {Object} - The HTTP response indicating a server error if an exception occurs.
 */
exports.blogs = async (req, res) => {
    try {
        const pageNumber = parseInt(req.query.pageNumber, 10) || 1;
        const pageSize = parseInt(req.query.pageSize, 10) || 8;
        const pipeline = [
            {
                $match: {
                    isApproved: true,
                },
            },
            {
                $sort: {
                    createdDate: -1,
                },
            },
            {
                $skip: (pageNumber - 1) * pageSize,
            },
            {
                $limit: pageSize,
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $unwind: "$user",
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    content: 1,
                    isApproved: 1,
                    createdDate: 1,
                    "user.firstName": 1,
                    "user.lastName": 1,
                },
            },
        ];

        const blogs = await Blog.aggregate(pipeline);
        logger.log("info", "Blogs Read successfully");
        return res.status(201).json({
            status: "Success",
            message: "Blogs Read successfully",
            data: blogs,
        });
    } catch (error) {
        logger.log("error", error);
        return res.status(500).json({ error: "Server error" });
    }
};

/**
 * Get a specific blog by its ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The path parameters in the request.
 * @param {string} req.params.id - The ID of the blog.
 * @param {Object} res - The response object.
 * @returns {Object} - The HTTP response containing the status, message, and data.
 * @throws {Object} - The HTTP response indicating an error if the blog is not found or a server error occurs.
 */
exports.blog = async (req, res) => {
    const { id } = req.params;
    if (id.length !== 24) {
        return res.status(400).json({
            status: "Fail",
            message: "Invalid blog id",
        });
    }
    try {
        const blog = await Blog.findById(id).populate([
            {
                path: "userId",
            },
        ]);

        if (!blog) {
            return res.status(404).json({
                status: "Fail",
                message: "Blog not found!",
            });
        }
        logger.log("info", "Blog Read successfully");
        return res.status(201).send({
            status: "Success",
            message: "Succesfully got the Blog",
            data: blog,
        });
    } catch (err) {
        logger.log("error", err);
        return res.status(500).json({
            status: "Fail",
            message: "Server Error",
        });
    }
};

/**
 * Create a new blog.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body containing title and content of the blog.
 * @param {string} req.userId - The ID of the user creating the blog.
 * @param {Object} res - The response object.
 * @returns {Object} - The HTTP response containing the status, message, and data of the created blog.
 * @throws {Object} - The HTTP response indicating a server error if an exception occurs.
 */
exports.createBlog = async (req, res) => {
    const { title, content } = req.body;
    const { userId } = req;
    const blog = new Blog({
        userId,
        title,
        content,
    });
    try {
        Blog;
        await blog.save();
        logger.log("info", "Blogs posted successfully");
        return res.status(201).json({
            status: "Success",
            message: "Blog posted successfully",
            data: blog,
        });
    } catch (err) {
        logger.log("error", err);
        return res.status(500).json({
            status: "Fail",
            message: "Server Error",
        });
    }
};

/**
 * Get blogs by user ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The path parameters in the request.
 * @param {string} req.params.userId - The ID of the user whose blogs are being fetched.
 * @param {Object} res - The response object.
 * @returns {Object} - The HTTP response containing the status, message, and data of the fetched blogs.
 * @throws {Object} - The HTTP response indicating a server error if an exception occurs.
 */
exports.getBlog = async (req, res) => {
    const { userId } = req.params;
    if (userId.length !== 24) {
        return res.status(400).json({
            status: "Fail",
            message: "Invalid userId",
        });
    }
    try {
        const blog = await Blog.find({ userId }).populate([
            {
                path: "userId",
            },
        ]);
        if (!blog) {
            return res.status(404).json({
                status: "Fail",
                message: "Data not Found",
            });
        }
        return res.status(200).json({
            status: "Success",
            message: " Blog get successfully",
            data: blog,
        });
    } catch (err) {
        logger.log("error", err);
        return res.status(500).json({
            status: "Fail",
            message: "Server Error",
            data: err,
        });
    }
};

/**
 * Get blog titles.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The HTTP response containing the status, message, and data of the fetched blog titles.
 * @throws {Object} - The HTTP response indicating a server error if an exception occurs.
 */
exports.getBlogTitle = async (req, res) => {
    try {
        logger.log("info", Request, Response);
        const projection = { title: 1 };
        const blogsd = await Blog.find({ isApproved: true }, projection).exec();
        const blogsData = blogsd.map((btitle) => ({
            title: btitle.title,
        }));
        return res.status(201).json({ blogs: blogsData });
    } catch (err) {
        logger.log("error", err);
        return res.status(500).json({
            status: "Fail",
            message: "Server Error",
        });
    }
};

/**
 * Delete a blog by its ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The path parameters in the request.
 * @param {string} req.params.id - The ID of the blog to be deleted.
 * @param {Object} res - The response object.
 * @returns {Object} - The HTTP response containing the status and message of the delete operation.
 * @throws {Object} - The HTTP response indicating an error if the blog is not found or a server error occurs.
 */
exports.deleteBlog = async (req, res) => {
    const { id } = req.params;
    if (id.length !== 24) {
        return res.status(400).json({
            status: "Fail",
            message: "Invalid blog id",
        });
    }
    try {
        const deleteblog = await Blog.findByIdAndDelete(id);
        if (!deleteblog) {
            return res.status(404).json({
                status: "Fail",
                message: "Already deleted!",
            });
        }
        logger.log("info", "Blogs deleted successfully");
        return res.status(201).send({
            status: "Success",
            message: "Succesfully deleted a blog",
        });
    } catch (err) {
        logger.log("error", err);
        return res.status(500).json({
            status: "Fail",
            message: "Server Error",
        });
    }
};

/**
 * Update a blog by its ID.
 *
 * @param {Object} req - The request object.
 * @param {string} req.params.id - The ID of the blog to be updated.
 * @param {Object} req.body - The updated data for the blog.
 * @param {Object} res - The response object.
 * @returns {Object} - The HTTP response containing the status, message, and data of the updated blog.
 * @throws {Object} - The HTTP response indicating an error if the blog is not found or a server error occurs.
 */
exports.updateBlog = async (req, res) => {
    const { id } = req.params;
    if (id.length !== 24) {
        return res.status(400).json({
            status: "Fail",
            message: "Invalid question id",
        });
    }
    try {
        const update = req.body;
        const updateblog = await Blog.findByIdAndUpdate(id, update, {
            new: true,
        });

        if (!updateblog) {
            return res.status(404).json({
                status: "Fail",
                message: "Blog not found!",
            });
        }
        logger.log("info", "Blogs updated successfully");
        return res.status(201).send({
            status: "Success",
            message: "Succesfully updated a blog",
            data: updateblog,
        });
    } catch (err) {
        logger.log("error", err);
        return res.status(500).json({
            status: "Fail",
            message: "Server Error",
        });
    }
};
