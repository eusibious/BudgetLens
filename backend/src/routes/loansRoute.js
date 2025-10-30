import express from "express";
import {
  createLoan,
  updateLoan,
  getLoanSummaryByUserId,
  getLoanByUserId,
} from "../controllers/loansController.js";

const router = express.Router();

router.get("/:userId", getLoanByUserId);
router.post("/", createLoan);
router.put("/:id", updateLoan);
router.get("/summary/:userId", getLoanSummaryByUserId);

export default router;
