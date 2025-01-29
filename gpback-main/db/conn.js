const mongoose=require('mongoose');

//mongodb://localhost:27017/userdata

mongoose.connect("mongodb+srv://vegcarton08:hrRvAYSe5xpBylhR@bankagentbridgegrievanc.cqdkm.mongodb.net/userdata",
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    console.log("Database Connected ");
}).catch((err)=>{
    console.log("No Connection to Database");
})