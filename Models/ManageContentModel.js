
import mongoose from "mongoose";

const manageSchema=new mongoose.Schema({
  name:{type:String},
  img:{type:String}
});


const objData={
  title:{type:String},
  paragraph:{type:String}
}

const objWtImg={
  title:{type:String},
  paragraph:{type:String},
  img:{type:String}
};

const contentSchema = new mongoose.Schema(
  {
    banner: {
      enum: ["Pcos", "Endometriosis", "Menopause", "Postpartum"],
      type: String,
      required: true,
    },

    bannerImg: {
      type: String,
    },
    whatIs: {
      type: objWtImg
    },
    commonSignsAndSymptoms: {
      type:objData
    },
    features: {
      type: [String],
      default: []      
    },
    whatCause: {
      type:objWtImg
    },
    howToManage: {
      type:objData
    },

    howToManageImg: {
      type:[manageSchema]
    },
    reduceSymptom: {
      type:objWtImg
    },
  },
  {
    timestamps: true,
  }
);

const contentModel = mongoose.model("content", contentSchema);

export default contentModel;




// ----------------------------

   












// import mongoose from "mongoose";

// const manageSchema=new mongoose.Schema({
//   name:{type:String},
//   img:{type:String}
// });

// const contentSchema = new mongoose.Schema(
//   {
//     banner: {
//       enum: ["Pcos", "Endometriosis", "Menopause", "Postpartum"],
//       type: String,
//       required: true,
//     },

//     bannerImg: {
//       type: String,
//     },
//     whatIs: {
//       type: {
//         title:{type:String},
//         paragraph:{type:String}
//       },
//     },
//     commonSignsAndSymptoms: {
//       type:{
//         title:{type:String},
//         paragraph:{type:String}
//       },
//     },
//     features: {
//       type: [String],
//       default: []      
//     },
//     whatCause: {
//       type:{
//         title:{type:String},
//         paragraph:{type:String}
//       },
//     },
//     howToManage: {
//       type:{
//         title:{type:String},
//         paragraph:{type:String}
//       },
//     },

//     howToManageImg: {
//       type:[manageSchema]
//     },
//     reduceSymptom: {
//       type:{
//         title:{type:String},
//         paragraph:{type:String}
//       },
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const contentModel = mongoose.model("content", contentSchema);

// export default contentModel;




// // ----------------------------

   

