import express from 'express';
import {register,login,loginOtpVerification,changePassword,forgotPassword,verifyOtpForPassword,resetPassword} from '../Controllers/validationController.js';
import {doctorRegistrations,blockDoctor,getAllDoctor,setAppointments,} from '../Controllers/doctorController.js';
import uploadAny from '../Helper/imgUploadHelper.js'
import setContent from '../Controllers/manageContentController.js'

import {buyPlan,allPlans} from '../Controllers/subscriptionController.js'


// ------middleware -----

import userAuthMiddleware from '../Middlewares/jwtMiddleware.js'


const route=express.Router();


// -------------------------user routes

route.post("/register",register);
route.post("/login",login);
route.post("/login/otp/verification",loginOtpVerification);
route.put("/changePassword",userAuthMiddleware,changePassword);

route.post("/forgotPassword",forgotPassword);
route.post("/verifyOtpForPassword",verifyOtpForPassword);
route.put("/resetPassword",resetPassword);
route.post("/content/set",setContent);




// -------------------------doctor routes



route.post("/doctor/register",uploadAny.single('profilePic'),doctorRegistrations);
route.put("/doctor/block",blockDoctor);
route.get("/doctor/all",getAllDoctor);
route.put("/doctor/setAppointments",setAppointments);



// -------------------user buy subscription ------------------------

route.post("/plan/buy",userAuthMiddleware,userAuthMiddleware,buyPlan);
route.get("/plan/allPlans",userAuthMiddleware,allPlans);



// -------------------------admin routes


export default route;
