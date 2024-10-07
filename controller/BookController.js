const conn = require('../db');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const crypto = require('crypto');


dotenv.config();

// (카테고리 별, 신간 여부) 전체 도서 목록 조회 
const allBooks = (req, res) => {
    let { category_id, news, limit, currentPage } = req.query;

    //limit : page당 도서 수     ex) 3
    //currentPage : 현재 페이지  ex) 1, 2, 3 ...
    //offset :                  ex) 0, 3, 6, 9, 12 ...  
    //                              limit * (currentPage-1)
    let offset = limit * (currentPage - 1);

    let sql = "SELECT * FROM books"
    let values = [];
    if (category_id && news) {
        sql += " WHERE category_id = ? AND pub_date BETWEEN DATE_SUB('2023-12-23', INTERVAL 1 MONTH) AND NOW()"
        values.push(category_id );
    } else if (category_id) {
        sql += " WHERE category_id = ?"
        values.push(category_id);
    } else if (news) {
        sql += " WHERE pub_date BETWEEN DATE_SUB('2023-12-23', INTERVAL 1 MONTH) AND NOW()"
    }
    sql += " LIMIT ? OFFSET ?"
    values.push(parseInt(limit), offset)

    conn.query(sql, values, (err, results) => {
        if (err)
            return res.status(StatusCodes.BAD_REQUEST).end();

        if (results.length)
            return res.status(StatusCodes.OK).json(results);

        return res.status(StatusCodes.NOT_FOUND).end();
    });
};

const bookDetail = (req, res) => {
    let { id } = req.params;

    let sql = `SELECT * FROM books LEFT JOIN category ON books.category_id = category.id 
                WHERE books.id = ?;`
    conn.query(sql, id, (err, results) => {
        if (err)
            return res.status(StatusCodes.BAD_REQUEST).end();

        if (results[0])
            return res.status(StatusCodes.OK).json(results[0]);

        return res.status(StatusCodes.NOT_FOUND).end();
    });
};


module.exports = {
    allBooks,
    bookDetail
};