const managerController = require("../controllers/manager");
const router = require("express").Router();

router.get("/drugs", managerController.getDrugs);

router.patch("/comment", managerController.updateCommentStatus);

router.delete("/comment/:commentId", managerController.clearComment);

router.post("/drugs/order", managerController.orderDrugs);

router.delete("/request", managerController.clearStoreRequest);

router.delete("/drug/:drugCode", managerController.clearSoldDrug);

router.delete("/drugs/:drugCodes", managerController.clearSoldDrugs);

router.post("/search", managerController.searchDrug);

module.exports = router;
