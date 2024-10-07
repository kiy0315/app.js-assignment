const conn = require('../db');
const { StatusCodes } = require('http-status-codes');

const addLike = (req, res) => {
    const { id } = req.params;
    const { user_id } = req.body

    let sql = "INSERT INTO likes (user_id, liked_book_id) VALUES (?,?)"
    let values = [user_id, id];
    conn.query(sql, values, (err, results) => {
        if (err)
            return res.status(StatusCodes.BAD_REQUEST).end();

        return res.status(StatusCodes.OK).json(results);
    })
};
const removeLike = (req, res) => {
    const { id } = req.params;
    const { user_id } = req.body

    let sql = "DELETE FROM likes WHERE liked_book_id = ? AND user_id = ?"
    let values = [user_id, id];
    conn.query(sql, values, (err, results) => {
        if (err)
            return res.status(StatusCodes.BAD_REQUEST).end();

        return res.status(StatusCodes.OK).json(results);
    })
}






module.exports = {
    addLike,
    removeLike
};
