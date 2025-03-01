// controllers/remarkController.js
const Remark = require("../model/remark");
const mongoose = require("mongoose");

exports.addRemark = async (req, res) => {
  try {
    const { remark, userId } = req.body; // Expecting userId in the request body

    // Check if userId is provided
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Create a new remark with initial user status
    const newRemark = await Remark.create({
      remark,
      userStatus: [{ userId, is_completed: false }], // Default status for the user
    });

    res.status(201).json({
      success: true,
      message: "Remark added successfully",
      remarks: newRemark,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding remark",
      error,
    });
  }
};

// Get Remarks for a User
exports.getRemarks = async (req, res) => {
  try {
    const { userId } = req.params;

    const remarks = await Remark.find().exec(); // Use .exec() to execute the query and return an array

    // Map through the remarks and add the specific user's status
    const updatedRemarks = remarks.map((remark) => {
      const userStatus = remark.userStatus.find(
        (status) => status.userId.toString() === userId.toString()
      );

      if (userStatus) {
        return {
          ...remark.toObject(), // Convert Mongoose doc to a plain object
          userStatus: userStatus, // Add the specific user status
        };
      } else {
        return {
          ...remark.toObject(),
          userStatus: { userId, is_completed: false }, // Default status if no entry exists
        };
      }
    });

    console.log(updatedRemarks, "remarks");

    // Return only the remarks specific to the user
    res.status(200).json({ success: true, remarks: updatedRemarks });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching remarks", error });
  }
};

exports.updateRemarkStatus = async (req, res) => {
  try {
    const { remarkId } = req.params; // Remark ID
    const { userId, is_completed } = req.body;
    console.log(req.body, req.params, "request");

    const remarkObjId = new mongoose.Types.ObjectId(remarkId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    console.log(req.body, req.params, "request");

    // Update the status of the existing user in the remark
    const updatedRemark = await Remark.findOneAndUpdate(
      { _id: remarkObjId, "userStatus.userId": userObjectId },
      { $set: { "userStatus.$.is_completed": is_completed } },
      { new: true }
    );

    // If no existing user status, push a new one
    if (!updatedRemark) {
      await Remark.findByIdAndUpdate(
        remarkObjId,
        { $push: { userStatus: { userId: userObjectId, is_completed } } },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      message: "Remark status updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error updating remark status",
      error,
    });
  }
};

// Delete a Remark
exports.deleteRemark = async (req, res) => {
  try {
    const { remarkId } = req.params;
    await Remark.findByIdAndDelete(remarkId);
    res.status(200).json({ success: true, message: "Remark deleted" });
  } catch (error) {
    console.log(error, "error deleting remark");
    res
      .status(500)
      .json({ success: false, message: "Error deleting remark", error });
  }
};
