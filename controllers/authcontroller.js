const User=require('../model/user')
const jwt=require('jsonwebtoken')
exports.signup=async (req,res,next)=>{
    try {
        const newUser=await User.create({
            email:req.body.email,
            name:req.body.name,
            password:req.body.password,
            number:req.body.number,
        })

        const token=jwt.sign({id:newUser._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN})
        
        res.status(201).json({status:"success",token,data:{user:newUser}});
    } catch (error) {
        console.error("Error creating user:", error);
        // 4. Send error response so the client isn't left hanging
        return res.status(500).json({
            message: "Failed to add user",
            error: error.message
        });
    }
    
}