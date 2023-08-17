const { default: mongoose } = require("mongoose");
const Tag = require("../../../models/tags");

module.exports = {
    addTag: async (req, res) => {
        try {
            const tag = req.body.name;
            const newTag = new Tag({ name: tag });
            await newTag.save();
            return res.status(201).json({
                status: 201,
                message: "Added Tag",
                data: newTag,
            });
        } catch (err) {
            if (err instanceof mongoose.Error.ValidationError) {
                return res.status(400).json({
                    status: 400,
                    message: "Invalid Tag",
                });
            }
            return res.status(500).json({
                status: 500,
                message: `Internal Server Error: ${err.message}`,
            });
        }
    },
    getAllTags: async (req, res) => {
        try {
            const projection = { name: 1 };
            const tags = await Tag.find({}, projection).exec();
            const allTags = tags.map((tag) => ({
                tag: tag.name,
                id: tag._id,
            }));
            return res.status(201).json({ tags: allTags });
        } catch (err) {
            return res.status(500).json({
                status: 500,
                message: "Server Error",
            });
        }
    },

    deleteTag: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(404).json({
                    status: 404,
                    message: "Tag Id not found",
                });
            }
            const tag = await Tag.findByIdAndDelete({ _id: id });
            if (!tag) {
                return res.status(404).json({
                    status: 404,
                    message: "Tag not found",
                });
            }
            return res.status(201).json({
                status: 201,
                message: "Tag deleted",
            });
        } catch (err) {
            return res.status(500).json({
                status: 500,
                message: "Server Error",
            });
        }
    },
};
