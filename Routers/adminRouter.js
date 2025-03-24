import express from 'express';
import {setPlans,editPlans,allBuyer} from '../Controllers/subscriptionController.js'
// import userAuthMiddleware from '../Middlewares/jwtMiddleware.js'




const route=express.Router();



// ----------------- Subscription plans ----------------

route.post("/plan/set",setPlans);
route.put("/plan/edit",editPlans);
route.get("/plan/allBuyer",allBuyer);


export default route