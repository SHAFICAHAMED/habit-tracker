const mongoose=require("mongoose")

const HabitSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    goal:{
        type:String,
        enum:['daily','weekly'],
        default:'daily'
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

})
module.exports=mongoose.model("Habit",HabitSchema);