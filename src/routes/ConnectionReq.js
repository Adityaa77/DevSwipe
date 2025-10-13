const express = require("express");
const requestRouter = express.Router();

const { UserAuth } = require("../middlewares/auth"); // Corrected to UserAuth
const ConnectionRequest = require("../models/connectionrequest"); // Corrected model name/case
const User = require("../models/user");

// NOTE: The sendEmail import is commented out as it was in the original snippet
// const sendEmail = require("../utils/sendEmail");

// POST /request/send/:status/:touserId
requestRouter.post(
  "/request/send/:status/:touserId",
  UserAuth,
  async (req, res) => {
    try {
      const fromuserId = req.user._id; // Changed to fromuserId
      const touserId = req.params.touserId; // Changed to touserId
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type: " + status });
      }

      const toUser = await User.findById(touserId);
      if (!toUser) {
        return res.status(404).json({ message: "User not found!" });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromuserId, touserId },
          { fromuserId: touserId, touserId: fromuserId },
        ],
      });
      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: "Connection Request Already Exists!!" });
      }

      const connectionRequest = new ConnectionRequest({
        fromuserId,
        touserId,
        status,
      });

      const data = await connectionRequest.save();

      // Updated message to use req.user.Name and toUser.Name
      res.json({
        message:
          req.user.Name + " is " + status + " in " + toUser.Name,
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

// POST /request/review/:status/:requestId
requestRouter.post(
  "/request/review/:status/:requestId",
  UserAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ messaage: "Status not allowed!" });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        touserId: loggedInUser._id, // Changed to touserId
        status: "interested",
      });
      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found" });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({ message: "Connection request " + status, data });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

// GET /user/requests/received - The route needed by your frontend component
requestRouter.get("/user/requests/received", UserAuth, async (req, res) => {
    try {
      const loggedinUser = req.user._id;

      const requests = await ConnectionRequest.find({
        touserId: loggedinUser,
        status: "interested",
      })
        // Critically important: populate the sender's user details
        .populate("fromuserId", "Name LastName PhotoUrl Age Gender About")
        .sort({ createdAt: -1 });

      res.json({
        message: "Received Connection Requests fetched successfully",
        data: requests, 
      });

    } catch (err) {
      res.status(500).send("Error fetching requests: " + err.message);
    }
});


module.exports = requestRouter;