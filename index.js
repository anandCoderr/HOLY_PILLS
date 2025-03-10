import express from 'express';
import 'dotenv/config'

const app=express();

app.use(express.json());


const portNum=process.env.PORT_NUM || 90000;

app.get("/",(req,res)=>{

    res.send("Hello World!");
});

app.listen(portNum,()=>{
    console.log(`Server is running on port ${portNum}`);
});