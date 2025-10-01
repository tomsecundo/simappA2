const express = require("express");
const router = express.Router();
const ProgramController = require("../controllers/programController");
const validateProgram = require("../middleware/validators/validateProgram");
const { protect, hasRole } = require('../middleware/authMiddleware');
const { UserRole } = require('../models/UserModel');

router.post("/", protect, hasRole(UserRole.ADMIN), validateProgram, ProgramController.create);
router.get("/", protect, ProgramController.getAll);
router.get("/:id", protect, ProgramController.getById);
router.put("/:id", protect, hasRole(UserRole.ADMIN), validateProgram, ProgramController.update);
router.delete("/:id", protect, hasRole(UserRole.ADMIN), ProgramController.delete);

module.exports = router;