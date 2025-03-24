import mongoose from "mongoose";

const purchaseSchema=new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"register"
    },
    planId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Subscription"
    },
    startDate:{
        type:Date
    },
    endDate:{
        type:Date
    },
    status:{
        type:String,
        enum:["active","inactive"],
        default:"inactive"
    },
    isCancel:{
        type:Boolean,
        default:false
    },
    price:{
        type:Number
    }

},{
    timestamps:true,
});

purchaseSchema.pre("find", function () {
    this.where({ endDate: { $gte: new Date() } }).updateMany({ status: "active" });
    this.where({ endDate: { $lt: new Date() } }).updateMany({ status: "inactive" });
});

const purchaseModel = mongoose.model("Purchase", purchaseSchema);

export default purchaseModel;




// --------auto delete schema when end date has passed --------

// const purchaseSchema = new mongoose.Schema({
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "register"
//     },
//     planId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Subscription"
//     },
//     startDate: {
//         type: Date
//     },
//     endDate: {
//         type: Date,
//         index: { expires: 0 }  // TTL Index: Auto-delete when `endDate` is reached
//     },
//     status: {
//         type: String,
//         enum: ["active", "inactive"],
//         default: "inactive"
//     },
//     isCancel: {
//         type: Boolean,
//         default: false
//     },
//     price: {
//         type: Number
//     }
// }, {
//     timestamps: true,
// });

// const purchaseModel = mongoose.model("Purchase", purchaseSchema);
// export default purchaseModel;
