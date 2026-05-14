const express = require('express');
const router = express.Router();

// Add admin routes here
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { getAllAgents } = require('../controllers/complaintController');

router.get(
  "/agents",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getAllAgents
);

module.exports = router;
