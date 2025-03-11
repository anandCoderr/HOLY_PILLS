import express from 'express';
import 'dotenv/config'
import connectToDb from './Config/dbConnect.js';
import authenticationRouter from './Routers/authenticationRouter.js';

const app=express();

app.use(express.json());


// ---------------Db Connect Function
connectToDb();

// ----------all routes --------------------------------

app.use('/user',authenticationRouter);




const portNum=process.env.PORT_NUM || 9000;

app.listen(portNum,()=>{
    console.log(`Server is running on port ${portNum}`);
});