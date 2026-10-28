const db = require("../db");

exports.getUsers = async (req, res, next) => {
  try {
    const [users] = await db.query(
      "SELECT id, name, email, created_at FROM users ORDER BY id"
    );
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    if (
      typeof name !== "string" || !name.trim() ||
      typeof email !== "string" || !email.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required"
      });
    }

    const [result] = await db.execute(
      "INSERT INTO users (name, email) VALUES (?, ?)",
      [name.trim(), email.trim()]
    );

    res.status(201).json({
      success: true,
      message: "User created",
      data: {
        id: result.insertId,
        name: name.trim(),
        email: email.trim()
      }
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Email already exists"
      });
    }
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { name, email } = req.body;

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        success: false, message: "Invalid user ID"
      });
    }

    if (
      typeof name !== "string" || !name.trim() ||
      typeof email !== "string" || !email.trim()
    ) {
      return res.status(400).json({
        success: false, message: "Name and email are required"
      });
    }

    const [result] = await db.execute(
      "UPDATE users SET name = ?, email = ? WHERE id = ?",
      [name.trim(), email.trim(), id]
    );

    if (result.affectedRows === 0) {
      const [rows] = await db.execute(
        "SELECT id FROM users WHERE id = ?", [id]
      );
      if (rows.length === 0) {
        return res.status(404).json({
          success: false, message: "User not found"
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "User updated"
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false, message: "Email already exists"
      });
    }
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        success: false, message: "Invalid user ID"
      });
    }

    const [result] = await db.execute(
      "DELETE FROM users WHERE id = ?", [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false, message: "User not found"
      });
    }

    res.status(200).json({
      success: true, message: "User and associated orders deleted"
    });
  } catch (error) {
    next(error);
  }
};
