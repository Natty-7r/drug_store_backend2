const adminController = require("../controllers/admin");
const router = require("express").Router();

router.get("/index", adminController.getIndex);

router.post("/account", adminController.createAccount);

router.delete("/account/:accountId", adminController.deleteAccount);

router.patch("/account/", adminController.changAccountState);

router.put("/account", adminController.updateAccount);

module.exports = router;
