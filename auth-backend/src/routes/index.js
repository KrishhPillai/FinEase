const express = require("express");
const router = express.Router();
const firebaseAuthController = require("../controllers/firebase-auth-controller.js");
const verifyToken = require("../middleware/index.js");

// Auth routes
router.post("/api/register", firebaseAuthController.registerUser);
router.post("/api/login", firebaseAuthController.loginUser);
router.post("/api/logout", firebaseAuthController.logoutUser);
router.post("/api/reset-password", firebaseAuthController.resetPassword);
router.post("/user-details", firebaseAuthController.checkUserDetailsByEmail);
router.post("/update-user-details", firebaseAuthController.updateUserDetails);

// Protected route example
router.get("/api/posts", verifyToken, (req, res) => {
  res.json({ message: "This is a protected route" });
});

module.exports = router;
