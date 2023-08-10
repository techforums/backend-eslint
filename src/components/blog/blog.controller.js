const { Request, Response } = require("express"); // Import the Request and Response types
const Blog = require("../../models/blog");
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
    res.json(blogs);
  } catch (error) {
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
      status: 400,
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
        status: 404,
        message: "Blog not found!",
      });
    }
    return res.status(201).send({
      status: 201,
      message: "Succesfully got the Blog",
      data: blog,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
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
  if (Object.keys(req.body).length === 0) {
    return res.status(406).json({
      status: 406,
      message: "Data not Found, Payload Not Acceptable",
    });
  }
  if (title === undefined) {
    return res
      .status(400)
      .json({ status: 400, message: "please enter the title" });
  }
  if (content === undefined) {
    return res
      .status(400)
      .json({ status: 400, message: "please enter the content" });
  }
  const { userId } = req;
  const blog = new Blog({
    userId,
    title,
    content,
  });
  try {
    Blog;
    await blog.save();
    res.status(201).json({
      status: 201,
      message: "Blog posted successfully",
      data: blog,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
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
      status: 400,
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
        status: 404,
        message: "Data not Found",
      });
    }
    res.status(200).json({
      status: 200,
      message: " Blog get successfully",
      data: blog,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
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
    return res.status(500).json({
      status: 500,
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
      status: 400,
      message: "Invalid blog id",
    });
  }
  try {
    const deleteblog = await Blog.findByIdAndDelete(id);
    if (!deleteblog) {
      res.status(404).json({
        status: 404,
        message: "Already deleted!",
      });
    } else {
      res.status(201).send({
        status: 201,
        message: "Succesfully deleted a blog",
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: 500,
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
      status: 400,
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
        status: 404,
        message: "Blog not found!",
      });
    } else {
      res.status(201).send({
        status: 201,
        message: "Succesfully updated a blog",
        data: updateblog,
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: "Server Error",
    });
  }
};
