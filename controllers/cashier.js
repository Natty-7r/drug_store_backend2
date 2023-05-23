const SoldDrug = require("../models/soldDrugs");

exports.getIndex = async (req, res, next) => {
  try {
    const yestedayTime = Date.now() - 24 * 3600 * 1000;
    const yesteday = new Date(yestedayTime);

    const unbilledDrugs = await SoldDrug.find({
      status: "unbilled",
    });
    const billedToday = await SoldDrug.find({
      status: "billed",
      updatedAt: {
        $gte: yesteday,
      },
    });

    res.json({
      status: "success",
      unbilledDrugs,
      billedToday,
    });
  } catch (error) {
    return res.json({
      status: "fail",
      message: "unable to fetch data",
      unbilledDrugs: [],
      billedToday: [],
    });
  }
};
exports.saveBillStatus = async (req, res, next) => {
  const { billedDrugs } = req.body;
  const billedDrugIds = billedDrugs.map((billedDrug) => billedDrug._id);
  try {
    const result = await SoldDrug.updateMany(
      { _id: { $in: billedDrugIds } },
      { status: "billed" }
    );

    if (!result.acknowledged) return res.json({ status: "fail" });
    return res.json({ status: "success" });
  } catch (error) {
    res.json({ status: "fail" });
  }
};
