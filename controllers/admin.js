const Account = require("../models/accounts");

const bcrypt = require("bcrypt");

exports.getIndex = async (req, res, next) => {
  try {
    let adminAccount,
      userAcccounts = [];

    adminAccount = await Account.findOne({
      role: "admin",
    });
    userAcccounts = await Account.find({});

    userAcccounts = userAcccounts.filter((account) => {
      return account.role != "admin";
    });

    res.json({
      status: "success",
      accounts: {
        adminAccount,
        userAcccounts,
      },
    });
  } catch (error) {
    return res.json({
      status: "fail",
      message: "unable to fetch data",
      accounts: {
        adminAccount: undefined,
        userAcccounts: [],
      },
    });
  }
};
exports.createAccount = async (req, res, next) => {
  const { account } = req.body;
  let userAcccount = undefined;
  try {
    userAcccount = await Account.findOne({ username: account.username });
    if (userAcccount) {
      const error = new Error();
      error.message = "User with the username Already Exists !";
      error.code = 123;
      error.statusCode = 500;
      throw error;
    }
    account.date = new Date();
    account.accountId = `user${Date.now().toString()}`;
    const hashPassword = await bcrypt.hash(account.password, 12);
    account.password = hashPassword;
    userAcccount = await Account.create(account);
    userAcccount = await userAcccount.save();

    if (!userAcccount) {
      const error = new Error();
      error.message = "Failed to Create User !";
      error.statusCode = 500;
      throw error;
    }
    res.json({ status: "success", userAcccount });
  } catch (error) {
    res.json({ status: "fail", message: error.message ,code:error.code });
  }
};
exports.deleteAccount = async (req, res, next) => {
  const accountId = req.params.accountId;

  try {
    const result = await Account.deleteOne({
      accountId: accountId,
    });
    if (!result.acknowledged) {
      const error = new Error("deleting unsuccesfull");
      error.statusCode = 500;
      throw error;
    }
    res.json({ status: "success" });
  } catch (error) {
    res.json({ status: "fail", message: error.message });
  }
};

exports.changAccountState = async (req, res, next) => {
  const { accountId, active } = req.body;
  try {
    const result = await Account.updateOne(
      { accountId: accountId },
      {
        active: active,
      }
    );
    if (!result.acknowledged) {
      const error = new Error();
      error.message = "update unsuccessful";
      throw error;
    }
    res.json({ status: "success" });
  } catch (error) {
    res.json({ status: "fail", message: error.message });
  }
};

exports.updateAccount = async (req, res, next) => {
  const { firstName, lastName, username, role, active, password, accountId } =
    req.body;
  const hashPassword = await bcrypt.hash(password, 12);
    const updateInfo= password == "" ?   {
        firstName: firstName,
        lastName: lastName,
        username: username,
        role: role,
        active: active,
      }:   {
        firstName: firstName,
        lastName: lastName,
        username: username,
        role: role,
        active: active,
        password:hashPassword,
      };

  try {
    const result = await Account.updateOne(
      {
        accountId: accountId,
      },
      updateInfo,
    
    );
    if (!result.acknowledged) {
      const error = new Error("updating  unsuccesfull");
      throw error;
    }
    console.log('ddd')
    res.json({ status: "success" });
  } catch (error) {
    console.log("ee")
    res.json({ status: "fail" });
  }
};
