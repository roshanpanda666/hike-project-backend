const mongoose=require("mongoose")


//hike schema
const hikeshema=new mongoose.Schema({
    name:String,
    startdate:Date,
    enddate:Date,
    difficulty:String,
    location:String,
    instructor:String,
    terrain:String,
    hiketype:String,
    peoplecoming:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"users",
    default:[],
    }],
})
const Hike=mongoose.model("hikes",hikeshema)

module.exports =Hike