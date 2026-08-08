const Hike=require('../model/hike')

//hike

async function addhike(req,res){
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "Request body cannot be empty" });
        }
        const addnewdata=await Hike.create(req.body)
        console.log(addnewdata)
        return res.status(201).json({message:"added successfully",data:addnewdata})
    } catch (error) {
        console.error("Error creating hike:", error);

        // 4. Send error response so the client isn't left hanging
        return res.status(500).json({
            message: "Failed to add hike",
            error: error.message
        });
    }
}

async function gethike(req,res){
    try {
        console.log(req.query)
        const getalldata=await Hike.find(req.query).populate("peoplecoming") // filtering 
        return res.status(200).json({message:"fetched all data successfully",data:getalldata})
    } catch (error) {
        return res.status(500).json({message:"error fetching the data"})
    }
}

async function specifichike(req,res){
    try {
        if(!req.params.id){
        res.status(500).json({message:"cant be empty param"})
    }
    const findspecifichike=await Hike.findById(req.params.id).populate("peoplecoming")
    console.log(findspecifichike)
    return res.status(200).json({message:"found it",findspecifichike})
    if(!findspecifichike){
        return res.status(404).json({message:"hike not found"})
    }
    } catch (error) {
        return res.status(500).json(error.message)
    }

}

module.exports={addhike,gethike,specifichike}