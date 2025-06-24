const express=require("express")
const router=express.Router()

const {
    markHabit,
    getLogsByDate   
}=require("../controllers/log.controller")

router.post("/logs",markHabit)
router.get("/logs/:date",getLogsByDate);

module.exports=router;