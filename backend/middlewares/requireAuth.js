const jwt=require('jsonwebtoken')
const pool=require('../db')
require('dotenv').config()


const requireAuth=async(req,res,next)=>{
    try {
        const token=req.headers.authorization
        if(!token) return res.status(400).json({message:'Login required'})
        
        jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
            if(err) return res.status(401).json({message:'Invalid Token'})
                req.user=user
                next()
        })
    } catch (error) {
        return res.status(500).json({message:'Internal Server Error'})
    }
}

const requireRole=(role)=>{
    return (req,res,next)=>{
        if (!req.user || req.user.role !== role) {
            return res.status(403).json({ message: "Forbidden: insufficient role" })
        }
        next()
    }
}

module.exports={requireAuth,requireRole}

