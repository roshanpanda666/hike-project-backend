const express=require("express")

const router=express.Router()

const { createuser, edithikearray, specificuser, similaritysearch, followersandfollowing, getallfollowersandfollowing, doapost, getallpost }=require("../controllers/user")

router.post("/create",createuser)

router.patch("/edithike/:id",edithikearray)

router.get("/find/:id",specificuser)

router.get("/findsimilaruser/:id",similaritysearch)

router.patch("/increasefollowingof/:id",followersandfollowing)

router.get("/findfollowerof/:id",getallfollowersandfollowing)

router.patch("/doapost/:id",doapost)

router.get("/getallpost/:id",getallpost)

module.exports=router