import express from "express";
import {
  createLoan,
  deleteLoan,
  getLoanSummaryByUserId,
  getLoanByUserId,
} from "../controllers/loansController.js";

const router = express.Router();

router.get("/:userId", getLoanByUserId);
router.post("/", createLoan);
router.delete("/:id", deleteLoan);
router.get("/summary/:userId", getLoanSummaryByUserId);

export default router;
