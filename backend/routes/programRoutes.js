const express = require("express");
const router = express.Router();
const ProgramController = require("../controllers/programController");
const validateProgram = require("../middleware/validators/validateProgram");
const { protect } = require('../middleware/authMiddleware');
const { UserRole } = require('../models/UserModel');
const ApplicationController = require("../controllers/applicationController");
const roleProxy = require('../middleware/roleProxy');

router.post("/", protect, roleProxy(UserRole.ADMIN), validateProgram, ProgramController.create);
router.get("/", protect, ProgramController.getAll);
router.get("/:id", protect, ProgramController.getById);
router.put("/:id", protect, roleProxy(UserRole.ADMIN), ProgramController.update);

router.get("/:id/applications", protect, ApplicationController.getByProgramId);

router.delete("/:id", protect, roleProxy(UserRole.ADMIN), ProgramController.delete);

module.exports = router;