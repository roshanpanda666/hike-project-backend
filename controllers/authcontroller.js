const User=require('../model/user')
const jwt=require('jsonwebtoken')
const bcrypt = require('bcryptjs'); // Assuming passwords are hashed with bcrypt
const {promisify}=require("util")

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


exports.protect = async (req, res, next) => {
    try {
        console.log("authenticating the user");

        // 1 - Get the token and check if it's there 
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            const error = new Error("You are not logged in, please log in to use the app");
            error.statusCode = 401;
            return next(error);
        }

        // 2 - Verification of the token
        // We use promisify to use async/await with jwt.verify instead of callbacks
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        // 3 - Check if the user still exists 
        // The token payload usually contains the user's ID (e.g., decoded.id)
        const currentUser = await User.findById(decoded.id); 
        
        if (!currentUser) {
            const error = new Error("The user belonging to this token no longer exists.");
            error.statusCode = 401;
            return next(error);
        }

        // 4 - Check if user changed password after the token was issued
        // You will need a method on your User model to check this (see below)
        if (currentUser.changedPasswordAfter && currentUser.changedPasswordAfter(decoded.iat)) {
            const error = new Error("User recently changed password! Please log in again.");
            error.statusCode = 401;
            return next(error);
        }

        // 5 - GRANT ACCESS TO PROTECTED ROUTE
        // Attach the user to the request object so subsequent middleware/controllers can use it
        req.user = currentUser;
        next();

    } catch (err) {
        // This catches JWT errors (like TokenExpiredError or JsonWebTokenError)
        err.statusCode = 401;
        err.message = "Invalid or expired token. Please log in again.";
        next(err);
    }
};