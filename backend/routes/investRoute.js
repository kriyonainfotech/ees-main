const express = require('express');
const {
  createPlan,
  getMonthlyPlans,
  getYearlyPlans,
  assignInvestmentPlan,
  getYearlyInvestors,
  getMonthlyInvestors,
  getUserInvestments,
} = require("../controllers/InvestController");
const router = express.Router();

//developer use only
router.post("/create-plan", createPlan);
router.get("/plans/monthly", getMonthlyPlans);
router.get("/plans/yearly", getYearlyPlans);
router.post("/assign-plan", assignInvestmentPlan);
router.get("/getyearlyInvestors", getYearlyInvestors);
router.get("/getmonthlyInvestors", getMonthlyInvestors);

router.post("/getUserInvestments", getUserInvestments);

module.exports = router;