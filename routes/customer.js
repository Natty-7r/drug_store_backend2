const customerController = require("../controllers/customer");
const router = require("express").Router();

router.get("/drug/:searchKey", customerController.searchDrug);

router.post("/comment", customerController.addComment);

module.exports = router;
