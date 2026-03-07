const express = require("express");
const profileRouter = express.Router();
const userAuth = require("../middleware/auth");
const bcrypt = require("bcrypt");

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      res.send("Invalid user....");
    }

    res.send(user);
  } catch (error) {
    res.status(400).send("Error" + message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const loggedinuser = req.user;

    const allowedkey = [
      "firstName",
      "lastName",
      "age",
      "gender",
      "photoURL",
      "about",
    ];

    const isallowed = Object.keys(req.body).every((item) =>
      allowedkey.includes(item),
    );

    if (!isallowed) {
      throw new Error("updates not allowed...");
    }

    Object.keys(req.body).forEach(
      (item) => (loggedinuser[item] = req.body[item]),
    );

    await loggedinuser.save();

    res.send("updated success....");
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

profileRouter.patch("/password/edit", userAuth, async (req, res) => {
  try {
    const loggedinuser = req.user;

    const allowedkey = ["password"];

    const isallowed = Object.keys(req.body).every((item) =>
      allowedkey.includes(item),
    );

    const newPassword = req.body.password;

    if (!isallowed) {
      throw new error("Only password allowed...");
    }

    const updatehashpassword = await bcrypt.hash(newPassword, 10);

    loggedinuser.password = updatehashpassword;

    res.send(loggedinuser);

    await loggedinuser.save();
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = profileRouter;
