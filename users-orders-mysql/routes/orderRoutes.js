const express = require("express");
const router = express.Router();

const {
  getOrders,
  createOrder,
  getOrdersByUser
} = require("../controllers/orderController");

router.get("/", getOrders);
router.get("/user/:userId", getOrdersByUser);
router.post("/", createOrder);

module.exports = router;
