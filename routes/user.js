const express=require("express")

const router=express.Router()

const { createuser, edithikearray, specificuser, similaritysearch, followersandfollowing, getallfollowersandfollowing, doapost, getallpost,hikecompleted,editpost,deleteapost,editexperience }=require("../controllers/user")
const authcontroller=require("../controllers/authcontroller")

router.post("/create",createuser)

router.patch("/edithike/:id",edithikearray)

router.get("/find/:id",specificuser)

router.get("/findsimilaruser/:id",similaritysearch)

router.patch("/increasefollowingof/:id",followersandfollowing)

router.get("/findfollowerof/:id",getallfollowersandfollowing)

router.patch("/doapost/:id",doapost)

router.get("/getallpost/:id",getallpost)

router.post("/signup",authcontroller.signup)

router.post("/login",authcontroller.login)

router.patch("/hikecompleted/:id",hikecompleted)

router.patch("/editpost/:id",editpost)

router.patch("/deletepost/:id",deleteapost)

router.patch("/edituserexp/:id",editexperience)

module.exports=router