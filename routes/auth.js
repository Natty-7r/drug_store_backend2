const authController = require("../controllers/auth");
const router = require("express").Router();

router.post("/login", authController.logIn);

module.exports = router;
