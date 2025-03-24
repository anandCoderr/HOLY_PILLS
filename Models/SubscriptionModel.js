import mongoose from "mongoose"

const plansSchema=new mongoose.Schema({
    title:{
        type:String
    },
    plan_description:{
        type:String
    },
    price:{
        type:Number,
    },
    country:{
        type:String,
    },
    currency:{
        type:String
    },
    duration:{
        type:Number,
        
    },
    consultant_count:{
        type:Number,

    }
},{
    timestamps:true,
});


const planModel=mongoose.model("Subscription",plansSchema);

export default planModel;


