const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const { requireRole } = require("../middleware/roleCheck");
const contactController = require("../controllers/contactController");

// Submit contact form (public)
router.post("/submit", contactController.submitContact);

// Subscribe to newsletter (public)
router.post("/newsletter", contactController.subscribeNewsletter);

// Get all contacts (admin only)
router.get(
  "/all",
  verifyToken,
  requireRole(["admin"]),
  contactController.getAllContacts,
);

// Update contact status (admin only)
router.put(
  "/:id/status",
  verifyToken,
  requireRole(["admin"]),
  contactController.updateContactStatus,
);

module.exports = router;
