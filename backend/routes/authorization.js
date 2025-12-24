// crate mini express app
const express=require('express')
const router=express.Router()

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const pool = require('../db')
require("dotenv").config()



// create users
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, role, full_name, department, api_key } = req.body
    

    // Check if user already exists
    const existing = await pool.query("SELECT * FROM users WHERE email=$1 OR username=$2", [email, username])

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "User with this email or username already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    console.log(hashedPassword)

    // Insert user
    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash, role, full_name, department, api_key)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, username, email, role, full_name, department`,
      [username, email, hashedPassword, role || "staff", full_name || null, department || null, api_key || null]
    );

    res.status(201).json({ message: "User created", user: result.rows[0] })
  } catch (err) {
    res.status(500).json({ message: "Internal Server error" ,err});
  }
})



// login
router.post('/login',async(req,res)=>{
    try {
        const { email, password } = req.body

        const result = await pool.query("SELECT * FROM users WHERE email=$1", [email])
        const user = result.rows[0]

        if(!user) return res.status(400).json({message:'User not found'})
        
        const valid = await bcrypt.compare(password, user.password_hash)
        if (!valid) return res.status(400).json({ message: "Invalid password" })

        const token = jwt.sign(
            { id: user.id, role: user.role, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
        )

        res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } })
    } catch (error) {
        res.status(500).json({ message: 'Internal Server error' })
    }
})


router.get("/me", async (req, res) => {
    try {
        const token = req.headers.authorization
        if (!token) return res.status(401).json({message:'please login'})
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            const result = await pool.query("SELECT id, username, email, role, full_name, department, is_active, created_at FROM users WHERE id=$1", [decoded.id])
            res.json(result.rows[0])
        } catch (err) {
            res.status(500).json({ message: 'Internal Server Error' })
    }
})



module.exports=router

