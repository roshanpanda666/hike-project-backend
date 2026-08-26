const User=require('../model/user')
const jwt=require('jsonwebtoken')
const bcrypt = require('bcryptjs'); // Assuming passwords are hashed with bcrypt

const signtoken=id=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN})
}
exports.signup=async (req,res,next)=>{
    try {
        const newUser=await User.create({
            email:req.body.email,
            name:req.body.name,
            password:req.body.password,
            number:req.body.number,
        })

        const token=signtoken(newUser._id)
        
        res.status(201).json({status:"success",token,data:{user:newUser}});
        
    } catch (error) {
        console.error("Error creating user:", error);

        if (error.code === 11000) {
            return res.status(400).json({ message: "Email already exists" });
        }

        return res.status(500).json({
            message: "Failed to add user",
            error: error.message
        });

    }
    
}

exports.login=async(req,res,next)=>{

    const {email,password,name,number}=req.body;

    // check email and password exist 
    if(!email ||!password){
        return res.status(400).json({message:"provide an email and password"})
    }
    try {
        //check if user exist and password is correct 
    const userexists=await User.findOne({email})
    if(!userexists){
        return res.status(401).json({message:"user not found"})
    }

    // check the hashed password 
    const ispasswordcorrect=await bcrypt.compare(password,userexists.password)
    if (!ispasswordcorrect) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
    const token=signtoken(userexists._id)
    return res.status(200).json({message:"correct password ",token}) // response back the token here
    } 
    
    catch (error) {
        console.error(error)
        return res.status(500).json({message:"something bad happened",error})
    }
    // if everything ok send token to the client 

}