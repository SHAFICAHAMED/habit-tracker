const Log=require("../models/log.model")


//mark status habit for today
const markHabit=async(req,res)=>{
    try{
        const {habitId,date,status}=req.body;

        let log=await Log.findOne({habitId,date});

        if(log){
            log.status=status;
        }
        else{
            log=new Log({habitId,date,status});
        }

        await log.save()
        res.status(200).json(log)

    }
    catch(err){
        res.status(500).json({message:err})
    }
};

//get all logs for a date
const getLogsByDate=async(req,res)=>{
    try{
        const {date}=req.params;

        const logs=await Log.find({date}).populate('habitId');
        res.json(logs)

    }
    catch(err){
        res.status(500).json({message:err})
    }
};
module.exports={
    markHabit,
    getLogsByDate   
};