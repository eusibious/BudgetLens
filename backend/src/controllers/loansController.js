import { sql } from "../config/db.js";

export async function getLoanByUserId(req, res) {
  try {
    const { userId } = req.params;

    const loans = await sql`
        SELECT * FROM loans WHERE user_id = ${userId} ORDER BY created_at DESC
      `;

    res.status(200).json(loans);
  } catch (error) {
    console.log("Error getting the loans", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createLoan(req, res) {
  try {
    const { loan_type, status, amount, name, borrow_date, due_date, user_id  } = req.body;

    if (!loan_type || !name || !user_id || amount === undefined || !borrow_date || !due_date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const loan = await sql`
      INSERT INTO loans(user_id,name,amount,loan_type,status,borrow_date,due_date)
      VALUES (${user_id},${name},${amount},${loan_type},${status},${borrow_date},${due_date})
      RETURNING *
    `;

    console.log(loan);
    res.status(201).json(loan[0]);
  } catch (error) {
    console.log("Error creating the loan", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteLoan(req, res) {
  try {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid loan ID" });
    }

    const result = await sql`
      DELETE FROM loans WHERE id = ${id} RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: "Loan not found" });
    }

    res.status(200).json({ message: "Loan deleted successfully" });
  } catch (error) {
    console.log("Error deleting the loan", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getLoanSummaryByUserId(req, res) {
  try {
    const { userId } = req.params;

    const borrowedAmount = await sql`
      SELECT COALESCE(SUM(amount), 0) as borrowed FROM loans WHERE user_id = ${userId} AND loan_type = 'borrow'
    `;
    const lendAmount = await sql`
      SELECT COALESCE(SUM(amount), 0) as lend FROM loans WHERE user_id = ${userId} AND loan_type = 'lend'
    `;
    const totalBorrowed = await sql`
      SELECT count(*) as borrowedCount FROM loans WHERE user_id = ${userId} AND loan_type = 'borrow'
    `;
    const totalLend = await sql`
      SELECT count(*) as lendCount FROM loans WHERE user_id = ${userId} AND loan_type = 'lend'
    `;
    const pendingBorrowed = await sql`
      SELECT COUNT(*) as count 
      FROM loans 
      WHERE user_id = ${userId} AND loan_type = 'borrow' AND status = 'pending'
    `;
    const pendingLend = await sql`
      SELECT COUNT(*) as count 
      FROM loans 
      WHERE user_id = ${userId} AND loan_type = 'lend' AND status = 'pending'
    `;
    

    


    res.status(200).json({
      borrowed: borrowedAmount[0].borrowed,
      lend: lendAmount[0].lend,
      totalBorrowed: totalBorrowed[0].borrowedCount,
      totalLend: totalLend[0].lendCount,
      pendingBorrowed: pendingBorrowed[0].count,
      pendingLend: pendingLend[0].count,  
    });
  } catch (error) {
    console.log("Error getting the summary", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
