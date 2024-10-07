const conn = require('../db');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const crypto = require('crypto');


dotenv.config();

const allCategory = (req, res) => {

    let sql = "SELECT * FROM category"
    conn.query(sql, (err, results) => {
        if (err)
            return res.status(StatusCodes.BAD_REQUEST).end();

        return res.status(StatusCodes.OK).json(results);
    });
};

module.exports = {
    allCategory,
};