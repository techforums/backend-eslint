const multer = require("multer");

const multerStorage = multer.memoryStorage();

// Multer Filter
const multerFilter = (req, file, cb) => {
    if (file.mimetype.split("/")[1] === "pdf") {
        cb(null, true);
    } else {
        cb(new Error("Not a PDF File!!"), false);
    }
};

// Calling the "multer" Function
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
}).single("file");

module.exports = upload;
