const express=require("express")
const authcontroller=require('../controllers/authcontroller')
const router=express.Router()

const {addhike, gethike, specifichike}=require('../controllers/hike')

router.post('/create',addhike)
router.get('/gethikedata',authcontroller.protect,gethike)
router.get('/specifichike/:id',specifichike)

module.exports=router