const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

// All admin routes require authentication and admin role
router.get("/users", auth, roleCheck("admin"), adminController.getAllUsers);
router.put(
  "/users/:id/verify",
  auth,
  roleCheck("admin"),
  adminController.verifyUser,
);

router.get(
  "/listings",
  auth,
  roleCheck("admin"),
  adminController.getAllListings,
);
router.put(
  "/listings/:id/flag",
  auth,
  roleCheck("admin"),
  adminController.flagListing,
);

router.get(
  "/misuse",
  auth,
  roleCheck("admin"),
  adminController.getMisuseReports,
);
router.put(
  "/misuse/:id/review",
  auth,
  roleCheck("admin"),
  adminController.reviewMisuseReport,
);
router.post(
  "/misuse/check-inactive",
  auth,
  roleCheck("admin"),
  adminController.runInactiveListingsCheck,
);

router.get(
  "/analytics",
  auth,
  roleCheck("admin"),
  adminController.getAnalytics,
);

module.exports = router;
