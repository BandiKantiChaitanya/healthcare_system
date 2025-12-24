const express=require('express')
const staffRouter=express.Router()
const pool = require("../db")
const { requireAuth, requireRole } = require('../middlewares/requireAuth')
require("dotenv").config()



// create incident
staffRouter.post('/incidents',requireAuth,requireRole('staff'),async(req,res)=>{
    try {
        const { title, description, severity } = req.body

        if (!title || !description || !severity) {
            return res.status(400).json({ message: "Title, description, and severity are required" })
        }

        const allowedSeverities = ["low", "medium", "high"]
        if (!allowedSeverities.includes(severity.toLowerCase())) {
            return res.status(400).json({ message: "Severity must be one of: low, medium, high" })
        }

        const result = await pool.query(
            "INSERT INTO incidents (title, description, severity, reported_by) VALUES ($1, $2, $3, $4) RETURNING *",
            [title, description, severity.toLowerCase(), req.user.id])
        res.status(200).json(result.rows[0])
    } catch (error) {
        res.status(500).json({ message: 'Internal Server error' })
    }
})

// list of incidents 
staffRouter.get('/incidents/me',requireAuth,requireRole('staff'),async(req,res)=>{
    try {
        const result = await pool.query("SELECT * FROM incidents WHERE reported_by=$1", [req.user.id])
        res.json(result.rows)
    } catch (error) {
        res.status(500).json({ message: 'Internal Server error' })
    }
})

module.exports=staffRouter
