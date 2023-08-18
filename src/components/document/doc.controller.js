const Document = require("../../models/doc");

/**
 * Get all posted documents with pagination and user details.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.query - The query parameters in the request.
 * @param {number} req.query.pageNumber - The page number for pagination (default: 1).
 * @param {number} req.query.pageSize - The number of documents per page (default: 5).
 * @param {Object} res - The response object.
 * @returns {Object} - The HTTP response containing the retrieved documents.
 * @throws {Object} - The HTTP response indicating a server error if an exception occurs.
 */
exports.getDocument = async (req, res) => {
    try {
        const pageNumber = parseInt(req.query.pageNumber, 10) || 1;
        const pageSize = parseInt(req.query.pageSize, 10) || 5;
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
                    fileName: 1,
                    docData: 1,
                    isApproved: 1,
                    createdDate: 1,
                    "user.firstName": 1,
                    "user.lastName": 1,
                },
            },
        ];

        const docs = await Document.aggregate(pipeline);
        return res.json(docs);
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Server Error",
        });
    }
};

/**
 * Get a specific document by its ID along with user details.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The params parameters in the request.
 * @param {string} req.params.id - The ID of the document.
 * @param {Object} res - The response object.
 * @returns {Object} - The HTTP response containing the retrieved document.
 * @throws {Object} - The HTTP response indicating a server error if an exception occurs.
 */
exports.getDocuments = async (req, res) => {
    const { id } = req.params;
    if (id.length !== 24) {
        return res.status(400).json({
            status: 400,
            message: "Invalid document id",
        });
    }
    try {
        const doc = await Document.findById(id).populate([
            {
                path: "userId",
            },
        ]);
        if (!doc) {
            return res.status(404).json({
                status: 404,
                message: "Document not found!",
                detail: "We cannot find the page you are looking for.",
            });
        }
        return res.status(201).json({
            status: 201,
            message: "Succesfully got the Document",
            data: doc,
        });
    } catch (err) {
        return res.status(500).json({
            status: 500,
            message: "Server Error",
        });
    }
};

/**
 * Get documents by user ID along with user details.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The params parameters in the request.
 * @param {string} req.params.userId - The ID of the user whose documents are fetched.
 * @param {Object} res - The response object.
 * @returns {Object} - The HTTP response containing the retrieved documents.
 * @throws {Object} - The HTTP response indicating a server error if an exception occurs.
 */

exports.getDocumentuser = async (req, res) => {
    try {
        const { userId } = req.params;
        const doc = await Document.find({ userId }).populate([
            {
                path: "userId",
            },
        ]);
        if (!doc) {
            return res.status(404).json({
                status: 404,
                message: "Data not Found",
            });
        }
        return res.status(200).json({
            status: 200,
            message: " Document get successfully",
            data: doc,
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
 * Post a new document.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.file - The uploaded file.
 * @param {string} req.userId - The ID of the user posting the document.
 * @param {Object} res - The response object.
 * @returns {Object} - The HTTP response indicating the status and outcome of the document posting operation.
 * @throws {Object} - The HTTP response indicating a server error if an exception occurs.
 */
exports.postDocument = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            status: 400,
            error: "No file uploaded",
        });
    }
    try {
        const { userId } = req;
        const fileName = req.file.originalname;
        const fileType = req.file.mimetype;
        const docData = req.file.buffer;
        const document = new Document({
            fileName,
            fileType,
            docData,
            userId,
        });
        await document.save();
        return res.status(201).json({
            status: 201,
            message: "Succesfully posted a Document",
            data: document,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Server Error",
            data: error,
        });
    }
};

/**
 * Delete a document by its ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The params parameters in the request.
 * @param {string} req.params.id - The ID of the document to be deleted.
 * @param {Object} res - The response object.
 * @returns {Object} - The HTTP response indicating the status and outcome of the document deletion operation.
 * @throws {Object} - The HTTP response indicating a server error if an exception occurs.
 */
exports.deleteDocument = async (req, res) => {
    const { id } = req.params;
    if (id.length !== 24) {
        return res.status(400).json({
            status: 400,
            message: "Invalid document id",
        });
    }
    try {
        const deleteD = await Document.findByIdAndDelete(id);
        if (!deleteD) {
            return res.status(404).json({
                status: 404,
                message: "Already deleted!",
                detail: "Document has already been deleted.",
            });
        }
        return res.status(201).json({
            status: 201,
            message: "Succesfully deleted Document",
        });
    } catch (err) {
        return res.status(500).json({
            status: 500,
            message: "Server Error",
        });
    }
};
