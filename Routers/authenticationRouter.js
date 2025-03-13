import express from 'express';
import {register,login,loginOtpVerification} from '../Controllers/validationController.js';
import {doctorRegistrations,blockDoctor,getAllDoctor,setAppointments} from '../Controllers/doctorController.js';
import uploadAny from '../Helper/imgUploadHelper.js'

const route=express.Router();

route.post("/register",register);
route.post("/login",login);
route.post("/login/otp/verification",loginOtpVerification);



// -------------------------doctor routes



route.post("/doctor/register",uploadAny.single('profilePic'),doctorRegistrations);
route.put("/doctor/block",blockDoctor);
route.get("/doctor/all",getAllDoctor);
route.put("/doctor/setAppointments",setAppointments);



export default route;
