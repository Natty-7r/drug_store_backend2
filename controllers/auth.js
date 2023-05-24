const Account = require("../models/accounts");
const bcrypt = require("bcrypt");

exports.logIn = async (req, res, next) => {
  const { username, password } = req.body;
  let user = undefined;
  try {
    const accounts = await Account.find({});
    if (accounts.length == 0) {
      const adminPassword = await bcrypt.hash("admin", 12);
      adminAccount = await Account.create({
        active: true,
        firstName: "admin ",
        lastName: "admin",
        date: new Date(),
        accountId: `admin${Date.now().toString()}`,
        role: "admin",
        username: "admin",
        password: adminPassword,
      });

      await adminAccount.save();
    }
    user = await Account.findOne({ username: username });
    if (!user) {
      // if user doesn't exist
      return res.json({
        auth: false,
        user: { username: undefined, role: undefined },
        message: "Invalid username !",
      });
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      // if wrong password
      return res.json({
        auth: false,
        user,
        message: "Invalid Password !",
      });
    }
    if (!user.active) {
      return res.json({
        auth: false,
        user,
        message: "account suspended for while!",
      });
    }
    res.json({
      auth: true,
      user: { username: user.username, role: user.role },
    });
  } catch (error) {
    return res.json({
      auth: false,
      user: { username: undefined, role: undefined },
      message: "Authentication failed !",
    });
  }
};
