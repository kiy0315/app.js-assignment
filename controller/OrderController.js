const conn = require('../db');
const { StatusCodes } = require('http-status-codes');



const order = async (req, res) => {
    const { items, delivery, totalQuantity, totalPrice, userId, firstBookTitle } = req.body

    let delivery_id;
    let order_id;
    let sql = "INSERT INTO delivery (address, receiver, contact) VALUES (?,?,?)"
    let values = [delivery.address, delivery.receiver, delivery.contact];
    let [results] = await conn.query(sql, values)
    delivery_id = results.insertId;

    sql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) 
         VALUES (?,?,?,?,?)`;
    values = [firstBookTitle, totalQuantity, totalPrice, userId, delivery_id];
    [results] = await conn.query(sql, values);
    order_id = results.insertId;

    sql = "SELECT fk_cartItems_book_id, quantity FROM cartItems WHERE id IN (?)";
    let [orderItems, fields] = await conn.query(sql, [items]);

    sql = `INSERT INTO orderedBook (order_id, book_id,quantity) VALUES ? `;
    values = [];
    console.log(orderItems)
    orderItems.forEach((item) => {
        values.push([order_id, item.fk_cartItems_book_id, item.quantity]);
    });

    results = await conn.query(sql, [values]);
    let result = await deleteCartItems();
    return res.status(StatusCodes.OK).json(result);


};
const deleteCartItems = async (req, res) => {
    sql = "DELETE FROM cartItems WHERE id IN (?)"
    let values = [1, 2, 3];

    let result = await conn.query(sql, [values]);
    return result;

}
const getOrders = async (req, res) => {
    let sql = `SELECT orders.id, created_at, address,receiver,contact, book_title, total_quantity, total_price
    FROM orders LEFT JOIN delivery 
    ON orders.delivery_id = delivery.id;`
    let [rows, fields] = await conn.query(sql);
    return res.status(StatusCodes.OK).json(rows);
}

const getOrderDetail = async (req, res) => {
    const { id } = req.params;
    let sql = `SELECT book_id, title as BookTitle, author, price, quantity 
    FROM orderedBook LEFT JOIN books ON orderedBook.book_id = books.id
    WHERE order_id = ? `
    let [rows, fields] = await conn.query(sql, [id]);
    return res.status(StatusCodes.OK).json(rows);

};
module.exports = {
    order,
    getOrders,
    getOrderDetail
};