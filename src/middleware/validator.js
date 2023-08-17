const {
    body, validationResult, check, query,
} = require("express-validator");

const signUpValidation = () => [
    // body.notEmpty()
    body("firstName")
        .notEmpty()
        .withMessage("firstname can't be empty")
        .trim()
        .matches(/^[a-zA-Z]+$/)
        .withMessage(
            "Invalid firstname, firstname must be string and white space not allow",
        ),
    body("lastName")
        .notEmpty()
        .withMessage("lastName can't be empty")
        .trim()
        .matches(/^[a-zA-Z]+$/)
        .withMessage(
            "Invalid lastName, lastName must be string and white space not allow",
        ),
    body("emailId")
        .notEmpty()
        .withMessage("emailid can't be empty")
        .trim()
        .isEmail()
        .withMessage("enter valid emailid"),
    body("password")
        .notEmpty()
        .withMessage("password can't be empty")
        .trim()
        .matches(
            /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])[A-Za-z0-9!@#$%^&*]{6,}$/,
        )
        .withMessage(
            "Invalid password,password must have atleast one uppercase, one number,one special character and minimum 6 length",
        ),
    body("confirmPassword")
        .notEmpty()
        .withMessage("password can't be empty")
        .trim(),
    check("confirmPassword")
        .custom((value, { req }) => value === req.body.password)
        .withMessage("Password not matched"),
];

const signInValidation = () => [
    body("emailId")
        .notEmpty()
        .trim()
        .isEmail()
        .withMessage("Enter valid email address!!"),
    body("password")
        .notEmpty()
        .isLength({ min: 6 })
        .withMessage("Password must be atleast 6 character!!"),
];

const searchValidation = () => [
    query("tags").notEmpty().withMessage("Enter a tag"),
];

const questionValidate = () => [
    body("userId")
        .notEmpty()
        .isLength(24)
        .withMessage("userId must have length of 24"),
    body("question").notEmpty().trim(),
    body("tags").trim(),
];
const anwerValidatePost = () => [
    body("userId")
        .notEmpty()
        .trim()
        .isLength(24)
        .withMessage("userId must have 24 character"),
    body("questionId")
        .notEmpty()
        .trim()
        .isLength(24)
        .withMessage("questionId must have 24 character"),
    body("answer").notEmpty().trim().withMessage("enter answer of the question"),
];

const answerValidateGetById = () => [
    query("questionId")
        .notEmpty()
        .trim()
        .isLength(24)
        .withMessage("question id can't be empyt and must have 24 character"),
];
const answerValidatePatch = () => [
    query("Id")
        .notEmpty()
        .trim()
        .isLength(24)
        .withMessage("question id can't be empyt and must have 24 character"),
];
const blogIdValidate = () => [
    query("userId")
        .notEmpty()
        .trim()
        .isLength(24)
        .withMessage("question id can't be empyt and must have 24 character"),
];

const blogValidatePost = () => [
    body("title").notEmpty().trim().withMessage("title can't be empty"),
    body("content").notEmpty().trim().withMessage("content can't be empty"),
    body("userId")
        .notEmpty()
        .trim()
        .isLength(24)
        .withMessage("must have the lenght of 24"),
];

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        return next();
    }

    const firstError = errors.array()[0];
    const errorMessage = firstError.msg;

    return res.status(422).json({
        status: "fail",
        message: errorMessage,
    });
};

module.exports = {
    signUpValidation,
    validate,
    signInValidation,
    searchValidation,
    questionValidate,
    anwerValidatePost,
    answerValidateGetById,
    answerValidatePatch,
    blogValidatePost,
    blogIdValidate,
};
