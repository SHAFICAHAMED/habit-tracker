const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")


//create app
const app=express()
app.use(cors())
app.use(express.json())

//routes
const habitRoutes=require("./routes/habit.routes")
app.use("/api",habitRoutes);

const logsRoutes=require('./routes/log.routes')
app.use('/api',logsRoutes)

mongoose
  .connect('mongodb+srv://shafickong:toIFNfqKaBvujDrr@cluster3.3uawaji.mongodb.net/?retryWrites=true&w=majority&appName=Cluster3', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

  //test route
  app.get("/",(req,res)=>{
    res.send("diciplin tracker is running")
  });

  const PORT=5000
  app.listen(PORT,()=>{
    console.log("server port running on http://localhost:"+PORT);
    
  })