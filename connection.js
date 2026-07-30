const mongoose=require("mongoose")
require("dotenv").config()


async function connectdb(){
    console.log("connecting to the database")
    return mongoose.connect(process.env.MONGOURI)
} 

module.exports=connectdb

