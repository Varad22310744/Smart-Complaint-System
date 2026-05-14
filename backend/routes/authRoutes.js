const express = require("express");
const router = express.Router();

const { registerUser, loginUser } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get(
  "/admin-test",
  authMiddleware,
  roleMiddleware("ADMIN"),
  (req, res) => {
    res.json({ message: "Welcome Admin" });
  }
);

module.exports = router;
