const express = require("express");
const userAuth = require("../middleware/auth");
const Connectionrequest = require("../models/connectionreqSchema");
const User = require("../models/user");
// const { Connection } = require("mongoose");
const connectionrequestRouter = express.Router();

connectionrequestRouter.post(
  "/connection/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserID = req.user._id;
      const toUserID = req.params.userId;
      const status = req.params.status;

      if (fromUserID === toUserID) {
        return res.status(400).json({
          message: "you cannot send request to your self....",
        });
      }

      const existinguser = await Connectionrequest.findOne({
        $or: [
          { fromUserID, toUserID },
          { fromUserID: toUserID, toUserID: fromUserID },
        ],
      });

      if (existinguser) {
        return res.status(400).json({
          message: "Connection is alredy exist..",
        });
      }

      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "invalid status type...",
        });
      }

      const connectionRequest = new Connectionrequest({
        fromUserID,
        toUserID,
        status,
      });

      await connectionRequest.save();

      res.status(200).json({
        message: "connection succcessful",
        data: connectionRequest,
      });
    } catch (error) {
      res.status(400).send("error:" + error.message);
    }
  },
);

connectionrequestRouter.post(
  "/connection/review/:status/:requestid",
  userAuth,
  async (req, res) => {
    try {
      const loggedinUser = req.user;

      const { status } = req.params;

      const isallowed = ["accepted", "rejected"];

      if (!isallowed.includes(status)) {
        return res.status(400).json({
          message: "Invalid status type...",
        });
      }

      const connectionRequest = await Connectionrequest.findOne({
        _id: req.params.requestid,
        toUserID: loggedinUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res.status(400).json({
          message: "Connection not found",
        });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({
        message: "Success",
        data,
      });
    } catch (error) {
      res.status(400).json({
        message: error,
      });
    }
  },
);

connectionrequestRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedinUser = req.user;

    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const connections = await Connectionrequest.find({
      $or: [{ fromUserID: loggedinUser._id }, { toUserID: loggedinUser._id }],
    }).select("fromUserID toUserID photoURL");

    const hideUsers = new Set();

    connections.forEach((element) => {
      hideUsers.add(element.fromUserID.toString());
      hideUsers.add(element.toUserID.toString());
      // hideUsers.add(loggedinUser._id.toString());
    });

    const user = await User.find({
      _id: { $nin: Array.from(hideUsers) },
    })
      .select("firstName lastName photoURL")
      .skip(skip)
      .limit(limit);

    res.json({
      message: "Feed is added successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

connectionrequestRouter.post(
  "/connection/remove/:requestID",
  userAuth,
  async (req, res) => {
    try {
      const loggedinUser = req.user;

      const connection = await Connectionrequest.findOne({
        _id: req.params.requestID,
        $or: [{ fromUserID: loggedinUser._id }, { toUserID: loggedinUser._id }],
        status: "accepted",
      });

      if (!connection) {
        return res.status(400).json({
          message: "There is no connectiob",
        });
      }

      connection.status = "rejected";

      const data = await connection.save();

      res.json({
        message: "Success",
        data,
      });
    } catch (error) {
      res.status(400).json({
        message: "Can not do",
      });
    }
  },
);

module.exports = connectionrequestRouter;
