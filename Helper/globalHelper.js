import { Validator } from 'node-input-validator';
import nodemailer from 'nodemailer';



const successHelper=(res,message="Success",status=200,data={})=>{
    return res.status(status).json({
        message,
        status,
        data,
    });

}


const errorHelper=(res,error)=>{
  // console.log("error helper:---->",error);

    const message=error.message || "Server Error";
    const statusCode=error.statusCode || error.status || 500;
    
    return res.status(statusCode).json({
        message,
        status: statusCode,
    });

}


const validatorHelper = async (body, validCheck) => {
    const v = new Validator(body, validCheck);
    const isValid = await v.check();
  
    if (!isValid) {
      return { success: false, errors: v.errors }; // Return error messages
    }
  
    return { success: true }; // Validation passed
  };
  




  const nodeMailerOtpHelper = async (to, sub, message) => {
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.USER_EMAIL,
          pass: process.env.USER_EMAIL_PASS,
        },
      });
  
      const info = await transporter.sendMail({
        from: process.env.USER_EMAIL,
        to: to,
        subject: sub,
        text: message,
      });
  
      console.log("Email sent: ", info.messageId);
  
      return info;
    } catch (err) {
      console.log("Error sending email", err.message || err);
      return null;
    }
  };

export {successHelper, errorHelper,validatorHelper,nodeMailerOtpHelper};