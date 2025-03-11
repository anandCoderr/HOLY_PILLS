import express from 'express';
import {register,login,loginOtpVerification} from '../Controllers/validationController.js';

const route=express.Router();

route.post("/register",register);
route.post("/login",login);
route.post("/login/otp/verification",loginOtpVerification);

export default route;
