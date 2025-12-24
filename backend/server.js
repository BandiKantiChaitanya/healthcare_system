// import express
const express=require('express')
const cors=require('cors')
const staffRouter = require('./routes/staffrouter')
const adminRouter = require('./routes/adminRouter')
const router = require('./routes/authorization')
require("dotenv").config()

// initialze app
const app=express()

// cors
app.use(cors())

// body parser
app.use(express.json())



app.use('/api',router)
app.use('/api/staff',staffRouter)
app.use('/api/admin',adminRouter)



// connet server
app.listen('8000',()=>{
    console.log('Sever running on port 8000')
})