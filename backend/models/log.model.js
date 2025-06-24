const mongoose=require("mongoose")

const LogSchema=new mongoose.Schema({
    habitId:{
        type:mongoose.Types.ObjectId,
        ref:'Habit',
        required:true       
    },
    date:{
        type:String,
        required:true  
    },
    status:{
        type:String,
        enum:['Complete','NotComplete'],
        default:'NotComplete',
        required:true    
    }

})
module.exports=mongoose.model("Log",LogSchema)