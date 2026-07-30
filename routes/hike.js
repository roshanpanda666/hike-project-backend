const express=require("express")

const router=express.Router()

const {addhike, gethike, specifichike}=require('../controllers/hike')

router.post('/create',addhike)
router.get('/gethikedata',gethike)
router.get('/specifichike/:id',specifichike)

module.exports=router