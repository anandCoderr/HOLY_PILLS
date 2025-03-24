import planModel from '../Models/SubscriptionModel.js'
import { successHelper, errorHelper,validatorHelper } from '../Helper/globalHelper.js'

import purchaseModel from '../Models/PurchasePlansModel.js'

// -------set plans

const setPlans = async (req, res) => {
  try {
    const { title, plan_description, price,country, currency, duration, consultant_count } = req.body;

    const plan = new planModel({
      title,
      plan_description,
      price,
      country,
      currency,
      duration,
      consultant_count,
    });

    await plan.save();

    return successHelper(res, "Plan created successfully", 201, plan);
  } catch (err) {
    return errorHelper(res, err);
  }
};

// -----------------edit plans

const editPlans = async (req, res) => {
  try {
    const { id } = req.query;
    const { title, plan_description, price,country, currency, duration, consultant_count } = req.body;

    const updatedPlan = await planModel.findByIdAndUpdate(
      id,
      {
        title,
        plan_description,
        price,
        country,
        currency,
        duration,
        consultant_count,
      },
      { new: true }
    );

    return successHelper(res, "Plan updated successfully", 200, updatedPlan);
  } catch (err) {
    return errorHelper(res, err);
  }
};





const buyPlan=async(req,res)=>{
  try{
    const { planId, startDate, endDate, price } = req.body;
    const loggedInUser=req.userId;

    const rules={
      planId:"required",
      startDate:"required",
      endDate:"required",
      price:"required"
    }
    const validationCheck=await validatorHelper(req.body,rules);
    
    if(!validationCheck.success){
      return errorHelper(res,validationCheck.errors);
    }

    const purchase=new purchaseModel({
     
      userId:loggedInUser,
      planId,
      startDate,
      endDate,
      price,
      status:"active"
    });

    await purchase.save();

    return successHelper(res,"Plan purchased successfully",200,purchase);

  }catch(err){
    return errorHelper(res,err);
  }

}


// ----------------get all plans details who bought ------> (Admin can access this Details)

const allBuyer=async(req,res)=>{
  try{

    const purchases=await purchaseModel.find({}).populate("userId planId");
    return successHelper(res,"All purchases",200,purchases);
  }catch(err){
    return errorHelper(res,err);
  }
}




// ------------user selected to see his plans and other one --------------------

const allPlans=async(req,res)=>{

  try{
    const loggedInUser=req.userId;
    const loggedUserCountry=req.userCountry; 


    const plans=await planModel.find({country:loggedUserCountry});

    // const userPlan=await purchaseModel.findOne({userId:loggedInUser,endDate:{$gt:Date.now()}},).populate("planId");
    const userPlan=await purchaseModel.findOne({$and:[{userId:loggedInUser},{status:"active"}]},).populate("planId");


    return successHelper(res,"All plans",200,[{userPlan,plans}]);

  }catch(err){
    return errorHelper(res,err);
  }

}



export {setPlans,editPlans,buyPlan,allBuyer,allPlans}