const express=require('express')
const adminRouter=express.Router()
const pool = require("../db")
const { requireAuth, requireRole } = require('../middlewares/requireAuth')
require("dotenv").config()




// List all incidents
adminRouter.get("/incidents", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM incidents ORDER BY created_at DESC")
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ message: 'Internal Server error' })
  }
})

// incidents by id 
adminRouter.get("/incidents/:id", requireAuth, requireRole("admin"), async (req,res)=>{
    try {
        const { id } = req.params
        const result = await pool.query("SELECT * FROM incidents WHERE id=$1", [id])
        if (!result.rows.length) return res.status(404).json({ message: "Incident not found" })
        res.json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Internal Server error" })
    }
})


// list incidents by filter
adminRouter.get("/incidents", requireAuth, requireRole("admin"), async (req, res) => {
    try {
        let { status, severity, search } = req.query
        const values = []
        let query = "SELECT * FROM incidents WHERE 1=1"

        if (status) {
            values.push(status.toLowerCase())
            query += ` AND status=$${values.length}`
        }
        if (severity) {
            values.push(severity.toLowerCase())
            query += ` AND severity=$${values.length}`
        }
        if (search) {
            values.push(`%${search}%`)
            query += ` AND (title ILIKE $${values.length} OR description ILIKE $${values.length})`
        }

        query += " ORDER BY created_at DESC"

        const result = await pool.query(query, values)
        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Internal Server error" })
    }
})



// Update incident 
adminRouter.patch("/incidents/:id", requireAuth, requireRole("admin"), async (req, res) => {
  try {
      const { id } = req.params
      const { status, admin_notes } = req.body

      const allowedStatuses = ["Pending", "In Progress", "Resolved"]
        if (status && !allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Status must be one of: Pending, In Progress, Resolved" })
        }


        const result = await pool.query(
          "UPDATE incidents SET status=$1, admin_notes=$2, updated_at=NOW() WHERE id=$3 RETURNING *",
          [status || null, admin_notes || null, id]
        )

        // for updating the incidents logs
        if (result.rows[0]) {
          const actionText = `Updated status to ${status || result.rows[0].status}, notes: ${admin_notes || ''}`
          
          await pool.query(
              "INSERT INTO audit_logs (user_id, incident_id, action) VALUES ($1, $2, $3)",
              [req.user.id, id, actionText]
          )
        }

    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ message: 'Internal Server error' })
  }
})

adminRouter.get("/incidents/:id/logs", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM audit_logs WHERE incident_id=$1 ORDER BY created_at DESC",
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server error" });
  }
});


module.exports = adminRouter
