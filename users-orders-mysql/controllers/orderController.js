const db = require("../db");

exports.getOrders = async (req, res, next) => {
  try {
    const [orders] = await db.query(`
      SELECT o.id, o.user_id, u.name AS user_name,
             o.product_name, o.quantity, o.total_amount,
             o.created_at
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.id
    `);

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

exports.createOrder = async (req, res, next) => {
  try {
    const { user_id, product_name, quantity, total_amount } = req.body;

    if (
      !Number.isInteger(user_id) || user_id < 1 ||
      typeof product_name !== "string" || !product_name.trim() ||
      !Number.isInteger(quantity) || quantity < 1 ||
      typeof total_amount !== "number" ||
      !Number.isFinite(total_amount) || total_amount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid user_id, product_name, quantity and total_amount are required"
      });
    }

    const [result] = await db.execute(
      `INSERT INTO orders
       (user_id, product_name, quantity, total_amount)
       VALUES (?, ?, ?, ?)`,
      [user_id, product_name.trim(), quantity, total_amount]
    );

    res.status(201).json({
      success: true,
      message: "Order created",
      data: {
        id: result.insertId,
        user_id,
        product_name: product_name.trim(),
        quantity,
        total_amount
      }
    });
  } catch (error) {
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        success: false, message: "The specified user does not exist"
      });
    }
    next(error);
  }
};

exports.getOrdersByUser = async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);

    if (!Number.isInteger(userId) || userId < 1) {
      return res.status(400).json({
        success: false, message: "Invalid user ID"
      });
    }

    const [users] = await db.execute(
      "SELECT id FROM users WHERE id = ?", [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false, message: "User not found"
      });
    }

    const [orders] = await db.execute(
      `SELECT id, user_id, product_name, quantity, total_amount, created_at
       FROM orders WHERE user_id = ? ORDER BY id`,
      [userId]
    );

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};
