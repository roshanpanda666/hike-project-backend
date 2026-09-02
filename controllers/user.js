const User = require('../model/user')
const Hike = require('../model/hike')
async function createuser(req, res) {
    try {
        if (!req.body) {
            return res.status(400).json({ message: "Request body cannot be empty" });
        }
        const adduser = await User.create(req.body)
        console.log(adduser)
        return res.status(201).json({ message: "user created successfully", data: adduser })
    } catch (error) {
        console.error("Error creating user:", error);
        // 4. Send error response so the client isn't left hanging
        return res.status(500).json({
            message: "Failed to add user",
            error: error.message
        });
    }
}

async function edithikearray(req, res) {
    try {

        const userid = req.params.id;
        const { hikeid,booked,paid } = req.body;

        if (!hikeid) {
            return res.status(400).json({ message: "hike id is required" })
        }

        const findhikeid = await Hike.findById(hikeid)

        if (!findhikeid) {
            return res.status(404).json({ message: "hike not found" })
        }

        const finduserid = await User.findById(userid)

        if (!finduserid) {
            return res.status(404).json({ message: "user not found" })
        }

        const updateuser = await User.findByIdAndUpdate(userid,
            { $addToSet: { hikes: {
                hike:hikeid,
                booked:booked ?? false,
                paid:paid ?? false
            } } }, 
            { new: true, runValidators: true }
        ).populate("hikes.hike")

        await Hike.findByIdAndUpdate(hikeid,
            { $addToSet: { peoplecoming: userid } }
        )
        console.log(updateuser)


        return res.status(200).json({
            message: "hike added to user profile successfully",
            data: updateuser
        })
    } catch (error) {
        console.error("Error adding hike:", error);
        return res.status(500).json({
            message: "Failed to update user hikes",
            error: error.message
        });
    }


}

async function specificuser(req, res) {

    if (!req.params.id) {
        return res.status(500).json({ message: "param is required" })
    }
    try {
        const finduser = await User.findById(req.params.id).populate("hikes.hike")
        console.log(finduser)
        if (!finduser) {
            return res.status(404).json({ message: "user not found" })
        }
        return res.status(200).json({ message: "found it", finduser })

    } catch (error) {
        console.log(error)
        return res.status(500).json(error.message)
    }

}
async function similaritysearch(req, res) {
    if (!req.params.id) {
        return res.status(400).json({ message: "param is required" });
    }

    try {
        const userid = req.params.id;

        // 1. Check if the target user exists
        const targetUserExists = await User.exists({ _id: userid });
        if (!targetUserExists) {
            return res.status(404).json({ message: "user not found" });
        }

        // 2. Use Mongoose/MongoDB distinct() to fetch a flat array of hike ObjectIds directly
        const targetHikeIds = await User.distinct("hikes.hike", { _id: userid });

        if (!targetHikeIds || targetHikeIds.length === 0) {
            return res.status(200).json({
                message: "User has no active hikes",
            });
        }

        // 3. Find other users who share any of these hikes
        const similaruser = await User.find({
            _id: { $ne: userid },
            "hikes.hike": { $in: targetHikeIds }
        }).populate("hikes.hike");

        return res.status(200).json({ 
            message: "similar users found", 
            data: similaruser, 
            count: similaruser.length 
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

async function followersandfollowing(req, res) {
    const currentuser = req.params.id
    const targetuser = req.body.id

    if (!currentuser) {
        return res.status(400).json({ message: "param missing" })
    }
    if (!targetuser) {
        return res.status(400).json({ message: "id is required in the body" })
    }

    if (currentuser === targetuser) {
        return res.status(400).json({ message: "You cannot follow yourself." });
    }

    try {
        // add target user to current user's following array
        const updatefollow = await User.findByIdAndUpdate(currentuser,
            { $addToSet: { following: targetuser } },
            { new: true }
        )
        if (!updatefollow) {
            return res.status(404).json({ message: "Current user not found." });
        }

        // add current user to target user's followers
        const updatetargetuser = await User.findByIdAndUpdate(targetuser,
            { $addToSet: { follower: currentuser } },
            { new: true }
        )

        if (!updatetargetuser) {
            return res.status(404).json({ message: "Target user to follow not found." });
        }

        //fetch current user

        const showresult = await User.findById(currentuser).populate("hikes.hike")

        return res.status(200).json({
            message: "Following updated successfully",
            following: targetuser,
            result: showresult
        })
    } catch (error) {
        console.error("Follow User Error:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

async function getallfollowersandfollowing(req, res) {
    const getcurrentuser = req.params.id
    if (!getcurrentuser) {
        return res.status(400).json({ message: "cant be empty param" })
    }
    try {
        const findtheuser = await User.findById(getcurrentuser).populate("follower").populate("following")
        if (!findtheuser) {
            return res.status(404).json({ message: "user not found" })
        }
        const followers = findtheuser.follower
        const following = findtheuser.following
        console.log("followers:", followers)
        console.log("following:", following)
        return res.status(200).json({ message: "got followers and following", followers: followers, following: following })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "server error" })
    }
}

async function doapost(req, res) {

    try {
        const userid = req.params.id
        if (!userid) {
            console.log("param is required")
            return res.status(500).json({ message: "param is missing" })
        }
        const finduser = await User.findById(userid)
        if (!finduser) {
            return res.status(404).json({ message: "user not found" })
        }
        const dopost = await User.findByIdAndUpdate(userid,
            {
                $push: { posts: { content: req.body.posts } },
            },
            { new: true, runValidators: true }
        )
        res.status(201).json({ success: true, data: dopost })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }


}
async function getallpost(req,res){
    const getcurrentuser=req.params.id
    if(!getcurrentuser){
        return res.status(500).json({message:"param needed"})
    }

    try {
        const finddata=await User.findById(getcurrentuser)
        console.log("user found",finddata.name)
        if(!finddata){
            return res.status(404).json({message:"user not found"})
        }
        const findpost=finddata.posts
        console.log(findpost)
        return res.status(200).json({message:"posts found",data:findpost})
    } catch (error) {
        console.error(error)  
        return res.status(500).json({message:"server side error"})
        
    }
}

async function hikecompleted(req,res){
    const userid=req.params.id
    const hikeid=req.body.hikeid
    if(!userid || !hikeid){
        return res.status(500).json({message:"param missing"})
    }
    try {
        const finduser=await User.findById(userid)
        if(!finduser){
            return res.status(404).json({message:"user not found"})
        }
        const findhike=await Hike.findById(hikeid)
        if(!findhike){
            return res.status(404).json({message:"hike not found"})
        }
        const updateuser=await User.findOneAndUpdate(
            { _id: userid, "hikes.hike": hikeid },
            { $set: { "hikes.$.completed": true } },
            { new: true, runValidators: true }
        )
        return res.status(200).json({message:"hike completed",data:updateuser})
    } catch (error) {
        console.error(error)
        return res.status(500).json({message:"server error"})
    }
}

async function editpost(req,res)
{
    const userid=req.params.id
    const editpostid=req.body.editpostid
    const content=req.body.content

    if(!userid || !editpostid){
        return res.status(500).json({message:"param missing"})
    }
    try {
        const editthepost=await User.findOneAndUpdate(
            {_id:userid,"posts._id":editpostid},
            {$set:{ "posts.$.content":content}},
            {new:true,runValidators:true}

        )
        if(!editthepost){
            return res.status(404).json({message:"post not found"})
        }
        return res.status(200).json({message:"post edited",data:editthepost})
        
    } catch (error) {
        console.error(error)
        return res.status(500).json({message:"server error"})
        
    }

}

async function deleteapost(req, res) {
    const userid = req.params.id;
    const postid = req.body.postid;

    if (!userid || !postid) {
        return res.status(500).json({ message: "param missing" });
    }

    try {
        // Use findByIdAndUpdate and $pull to remove the post from the array
        const updatetheuser = await User.findByIdAndUpdate(
            userid,
            { $pull: { posts: { _id: postid } } },
            { new: true }
        );

        if (!updatetheuser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ 
            message: "Post deleted successfully", 
            data: updatetheuser 
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "server error" });
    }
}

module.exports = { createuser, edithikearray, specificuser, similaritysearch, followersandfollowing, getallfollowersandfollowing, doapost , getallpost,hikecompleted,hikecompleted,editpost , deleteapost}