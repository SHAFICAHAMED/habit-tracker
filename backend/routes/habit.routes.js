const express=require("express")
const router=express.Router()

const{
    createHabit,
    getHabits,
    deleteHabit 
}=require("../controllers/habit.controller")

//routes
router.post('/habits',createHabit)
router.get('/habits',getHabits);
router.delete('/habits/:id',deleteHabit);

module.exports=router;