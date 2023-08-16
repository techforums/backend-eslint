const { Request, Response } = require("express"); // Import the Request and Response types
const Blog = require("../../models/blog");
const logger = require("../../logs/logger");
/**
 * Get all posted blogs
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */
exports.blogs = async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 8;
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
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Get a specific blog by ID.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
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
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
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
    res.status(201).json({
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
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
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
    res.status(200).json({
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
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
exports.getBlogTitle = async (req, res) => {
  try {
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
 * Delete a blog by ID.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
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
      res.status(404).json({
        status: "Fail",
        message: "Already deleted!",
      });
    } else {
      logger.log("info", "Blogs deleted successfully");
      res.status(201).send({
        status: "Success",
        message: "Succesfully deleted a blog",
      });
    }
  } catch (err) {
    logger.log("error", err);
    return res.status(500).json({
      status: "Fail",
      message: "Server Error",
    });
  }
};

/**
 * Update a blog by ID.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
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
      res.status(404).json({
        status: "Fail",
        message: "Blog not found!",
      });
    } else {
      logger.log("info", "Blogs updated successfully");
      res.status(201).send({
        status: "Success",
        message: "Succesfully updated a blog",
        data: updateblog,
      });
    }
  } catch (err) {
    logger.log("error", err);
    return res.status(500).json({
      status: "Fail",
      message: "Server Error",
    });
  }
};
