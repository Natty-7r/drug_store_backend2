const supplierContoller = require("../controllers/supplier");

const router = require("express").Router();

router.get("/index", supplierContoller.getIndex);

router.post("/comment", supplierContoller.addComment);

router.post("/register", supplierContoller.sendOrder);

router.patch("/order", supplierContoller.chageOrderStatus);

router.delete("/order/:requestId", supplierContoller.clearOrder);

module.exports = router;

module.exports = router;
