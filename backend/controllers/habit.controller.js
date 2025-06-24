const Habit=require("../models/habit.model")

//create habit
const createHabit=async(req,res)=>{
    try{
    const {title,goal}=req.body

    const habit=new Habit({title,goal});
    await habit.save();

    res.status(200).json(habit);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
}

//get all habits
const getHabits=async(req,res)=>{
      try{
        const habits=await Habit.find().sort({createdAt:-1})
    res.json(habits);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
};

//delete habit
const deleteHabit=async(req,res)=>{
      try{
        const{id}=req.params;
        await Habit.findByIdAndDelete(id);
        res.json({message:"habit deleted successfuly"});
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
};
module.exports={
    createHabit,
    getHabits,
    deleteHabit 
}