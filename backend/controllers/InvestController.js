const express = require("express");
const router = express.Router();
const InvestmentPlan = require("../model/investmentPlan");
const UserInvestment = require("../model/userInvestment");
const User = require("../model/user");

// Create a new investment plan (Admin Only)
const createPlan = async (req, res) => {
  try {
    let { investmentAmount, type, returnAmount, duration } = req.body;

    // Validate Input
    if (!investmentAmount || !type || !returnAmount || !duration) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Convert duration to months if type is "yearly"
    if (type === "yearly") {
      duration = duration * 12; // Convert years to months
    }

    // Create Plan
    const newPlan = new InvestmentPlan({ investmentAmount, type, returnAmount, duration });
    await newPlan.save();

    res.status(201).json({ success: true, message: "Investment Plan Created", plan: newPlan });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};
const getMonthlyPlans = async (req, res) => {
  try {
    const monthlyPlans = await InvestmentPlan.find({ type: "monthly" });
    const count = monthlyPlans.length;

    res.status(200).json({ success: true, count, plans: monthlyPlans });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

const getYearlyPlans = async (req, res) => {
  try {
    const yearlyPlans = await InvestmentPlan.find({ type: "yearly" });
    const count = yearlyPlans.length;

    res.status(200).json({ success: true, count, plans: yearlyPlans });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }

};const assignInvestmentPlan = async (req, res) => {
  try {
    const { phone, planId } = req.body;

    if (!phone || !planId) {
      return res.status(400).json({ success: false, message: "Phone and Plan ID are required" });
    }

    // Find User by Phone
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Find Investment Plan by ID
    const plan = await InvestmentPlan.findById(planId);
    if (!plan) {
      return res.status(404).json({ success: false, message: "Investment Plan not found" });
    }

    // Convert Yearly Duration to Months
    const durationInMonths = plan.type === "yearly" ? plan.duration * 12 : plan.duration;

    // Calculate next payout date based on plan type
    const nextPayoutDate = new Date();
    if (plan.type === "yearly") {
      nextPayoutDate.setFullYear(nextPayoutDate.getFullYear() + 1);
    } else {
      nextPayoutDate.setMonth(nextPayoutDate.getMonth() + 1);
    }

    // Create User Investment
    const newInvestment = new UserInvestment({
      userId: user._id,
      planId: plan._id,
      amount: plan.investmentAmount,
      startDate: new Date(),
      nextPayoutDate,
      status: "active"
    });

    await newInvestment.save();

    res.status(201).json({ success: true, message: "Investment Plan Assigned", investment: newInvestment });
  } catch (error) {
    console.log(error,'error in assignInvestmentPlan')
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

const getYearlyInvestors = async (req, res) => {
  try {
    console.log("📢 Fetching yearly investment plans...");

    // Fetch all yearly investment plans
    const yearlyPlans = await InvestmentPlan.find({ type: "yearly" });
    console.log("✅ Yearly Plans Found:", yearlyPlans);

    if (!yearlyPlans.length) {
      console.log("⚠️ No yearly plans found!");
      return res.status(404).json({ success: false, message: "No yearly plans found" });
    }

    // Extract yearly plan IDs
    const yearlyPlanIds = yearlyPlans.map(plan => plan._id);
    console.log("🔍 Yearly Plan IDs:", yearlyPlanIds);

    // Fetch user investments linked to yearly plans
    console.log("📢 Fetching user investments linked to yearly plans...");
    const investments = await UserInvestment.find({ planId: { $in: yearlyPlanIds } })
      .populate("userId", "name phone")
      .populate("planId", "investmentAmount returnAmount duration");

    console.log("✅ Investments Found:", investments.length);

    if (!investments.length) {
      console.log("⚠️ No investments found for yearly plans!");
    }

    // Map data for frontend
    const investors = investments.map((inv) => ({
      _id: inv._id,
      userName: inv.userId?.name || "Unknown",
      phone: inv.userId?.phone || "N/A",
      amount: inv.amount,
      investmentAmount: inv.planId?.investmentAmount,
      returnAmount: inv.planId?.returnAmount,
      duration: inv.planId?.duration,
      startDate: inv.startDate,
      nextPayoutDate: inv.nextPayoutDate,
      status: inv.status, // Active or Completed
    }));

    console.log("📊 Final Investors Data:", investors);

    res.status(200).json({ success: true, investors });
  } catch (error) {
    console.error("❌ Error fetching yearly investors:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
const getMonthlyInvestors = async (req, res) => {
  try {
    console.log("📢 Fetching monthly investment plans...");

    // Fetch all yearly investment plans
    const monthlyPlans = await InvestmentPlan.find({ type: "monthly" });
    console.log("✅ monthly Plans Found:", monthlyPlans);

    if (!monthlyPlans.length) {
      console.log("⚠️ No monthly plans found!");
      return res.status(404).json({ success: false, message: "No monthly plans found" });
    }

    // Extract monthly plan IDs
    const monthlyPlanIds = monthlyPlans.map(plan => plan._id);
    console.log("🔍 monthly Plan IDs:", monthlyPlanIds);

    // Fetch user investments linked to monthly plans
    console.log("📢 Fetching user investments linked to monthly plans...");
    const investments = await UserInvestment.find({ planId: { $in: monthlyPlanIds } })
      .populate("userId", "name phone")
      .populate("planId", "investmentAmount returnAmount duration");

    console.log("✅ Investments Found:", investments.length);

    if (!investments.length) {
      console.log("⚠️ No investments found for monthly plans!");
    }

    // Map data for frontend
    const investors = investments.map((inv) => ({
      _id: inv._id,
      userName: inv.userId?.name || "Unknown",
      phone: inv.userId?.phone || "N/A",
      amount: inv.amount,
      investmentAmount: inv.planId?.investmentAmount,
      returnAmount: inv.planId?.returnAmount,
      duration: inv.planId?.duration,
      startDate: inv.startDate,
      nextPayoutDate: inv.nextPayoutDate,
      status: inv.status, // Active or Completed
    }));

    console.log("📊 Final Investors Data:", investors);

    res.status(200).json({ success: true, investors });
  } catch (error) {
    console.error("❌ Error fetching monthly investors:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



module.exports = { createPlan ,getMonthlyPlans, getYearlyPlans ,assignInvestmentPlan , getYearlyInvestors,getMonthlyInvestors};
