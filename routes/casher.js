const casherController = require("../controllers/cashier");
const router = require("express").Router();

router.get("/index", casherController.getIndex);

router.post("/bill", casherController.saveBillStatus);

module.exports = router;
