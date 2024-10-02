const express = require('express');
const router = express.Router();
const conn = require('../db');
const { StatusCodes } = require('http-status-codes');
const { body, param, validationResult } = require('express-validator')
const { join, login, passwordResetRequest, passwordReset } = require('../controller/UserController');

router.use(express.json());


const validate = (req, res, next) => {
    const err = validationResult(req)
    if (err.isEmpty())
        return next();
    return res.status(StatusCodes.BAD_REQUEST).json(err.array());
}


//회원가입
router.post('/join',
    [
        body('email').notEmpty().isEmail().withMessage('이메일 확인 필요'),
        body('password').notEmpty().isString().withMessage('패스워드 확인 필요'),
        validate
    ]
    , join
);


router.post('/login',
    [
        body('email').notEmpty().isEmail().withMessage("이메일 확인 필요"),
        body('password').notEmpty().isString().withMessage("패스워드 입력 필요"),
        validate
    ],login);

router.route('/reset')
    .post(passwordResetRequest)
    .put(passwordReset);


module.exports = router;
