import RegisterModel from "../Models/RegisterModel.js";
import bcrypt from "bcrypt";
import OtpModel from "../Models/OtpModel.js";
import jwt from "jsonwebtoken";


import {
  successHelper,
  errorHelper,
  validatorHelper,
  nodeMailerOtpHelper,
} from "../Helper/globalHelper.js";

const register = async (req, res) => {
  try {
    const { name, email, password, phone, avatarImg,country } = req.body;

    const rules = {
      name: "required|min:3",
      email: "required|email",
      password: "required",
      phone: "required",
      country: "required",
    };

    const checkValid = await validatorHelper(req.body, rules);

    if (!checkValid) {
      return errorHelper(res, checkValid.errors);
    }

    // const userExist=await RegisterModel.findOne({email});

    const [emailCheck, phoneCheck] = await Promise.all([
      RegisterModel.findOne({ email }),
      RegisterModel.findOne({ phone }),
    ]);

    if (emailCheck || phoneCheck) {
      return errorHelper(res, {
        message: "User already exist",
        status: 409,
      });
    }

    const defaultSetImg =
      avatarImg ||
      "https://img.freepik.com/free-vector/mysterious-mafia-man-smoking-cigarette_52683-34828.jpg?t=st=1741601355~exp=1741604955~hmac=4643153eebc25b078789a3fc13147318e6332e335a8191b611f66201f317297f&w=740";
    const user = new RegisterModel({
      name,
      email,
      password,
      phone,
      profileImg: defaultSetImg,
      country
    });

    await user.save();

    return successHelper(res, "User Register Successfully", 201, user);
  } catch (err) {
    return errorHelper(res, err);
  }
};

// ---------------------login--------------

const login = async (req, res) => {
  try {
    const { mailOrNumVar, password } = req.body;

    const rules = {
      mailOrNumVar: "required",
      password: "required",
    };

    const checkValid = await validatorHelper(req.body, rules);

    if (!checkValid) {
      return errorHelper(res, checkValid.errors);
    }

    const isEmail =
      typeof mailOrNumVar === "string" && mailOrNumVar?.includes("@");

    const query = isEmail
      ? { email: mailOrNumVar }
      : { phone: Number(mailOrNumVar) };

    const user = await RegisterModel.findOne(query);

    if (!user) {
      const msg = isEmail ? "Email" : "Number";

      return errorHelper(res, {
        message: `${msg} is not valid`,
        status: 404,
      });
    }

    // ------------Valid password check;

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return errorHelper(res, {
        message: "Incorrect Password",
        status: 401,
      });
    }

    // ----for email only
    const otp = Math.floor(100000 + Math.random() * 900000);

    console.log(`your otp is:----> ${otp}`);

    const transportInstance = nodeMailerOtpHelper(
      mailOrNumVar,
      "Email Verification Otp",
      `Your email verification Opt is:- ${otp}`
    );

    if (!transportInstance) {
      return errorHelper(res, { message: "Error sending OTP", status: 500 });
    }

    await OtpModel.findOneAndUpdate(
      { emailOrNum: mailOrNumVar },
      { otp },
      { upsert: true, new: true }
    );

    return successHelper(res, "Sent Otp to verify for Login", 200, {
      otp,
    });
  } catch (err) {
    return errorHelper(res, err);
  }
};


// -------------user Login Otp verifications --------------------------------


const loginOtpVerification = async (req, res) => {
  try {
    const { mailOrNumVar, otp } = req.body;

    const rules = {
      mailOrNumVar: "required",
      otp: "required",
    };
    const checkValid = await validatorHelper(req.body, rules);

    if (!checkValid) {
      return errorHelper(res, checkValid.errors);
    }

    // --------------otp verification in temporary model ------------------------------

    const otpData = await OtpModel.findOne({
      $and: [{ emailOrNum: mailOrNumVar }, { otp }],
    });

    if (!otpData) {
      return errorHelper(res, { message: "Invalid Otp", status: 401 });
    }


    const mailOrNumCheck=typeof mailOrNumVar === "string" && mailOrNumVar.includes("@");

    const gotValidRes=mailOrNumCheck ? { email: mailOrNumVar } : { phone: mailOrNumVar };

    const checkUser = await RegisterModel.findOne(gotValidRes);

    if (!checkUser) {
      return errorHelper(res, { message: "User not found", status: 404 });
    }

    // -----------converting into jwt token
    var token = jwt.sign({ userId: checkUser._id, userCountry:checkUser.country }, process.env.SECREAT_KEY);

    return successHelper(res, "User Login Successfully", 200, {
      user: checkUser,
      token: token,
    });
  } catch (err) {
    return errorHelper(res, err);
  }
};


// ------------------ Change passwords ----------------


const changePassword = async (req, res) => {
  const { oldPass, newPassword, confirmNewPass } = req.body;
  const loggedInUser = req.userId;


  // ---- from auth we will get user id


  try {
    const rules = {
      oldPass: "required",
      newPassword: "required",
      confirmNewPass: "required",
    };

    const validationCheck = await validatorHelper(req.body, rules);
    if (!validationCheck.success) {
      return errorHelper(res, validationCheck.errors);
    }

// --------------validation check


    const user = await RegisterModel.findById(loggedInUser);

    const oldPassEnc = await bcrypt.compare(oldPass, user.password);

    if (!oldPassEnc) {
      return errorHelper(res, {
        message: "Old Password is incorrect",
        status: 422,
      });
    }

    if (newPassword !== confirmNewPass) {
      return errorHelper(res, {
        message: "New Password and Confirm Password do not match",
        status: 422,
      });
    }

    const passEnc = await bcrypt.hash(newPassword, 10);

    const confirmedPass = await RegisterModel.findByIdAndUpdate(
      loggedInUser,
      { $set: { password: passEnc } },
      { new: true }
    );

    return successHelper(
      res,
      "Password changed successfully",
      200,
      confirmedPass
    );
  } catch (err) {
    return errorHelper(res, err);
  }
};



// ---------- forgot password ----------------



const forgotPassword = async (req, res) => {
  try {
    const { emailOrNum } = req.body;

    // -------------------validation check
    const rules = {
      emailOrNum: "required",
    };

    const validationCheck = await validatorHelper(req.body, rules);
    if (!validationCheck.success) {
      return errorHelper(res, validationCheck.errors);
    }

// ---------------otp code starts here --------------------

        const userFindInstant=isNaN(emailOrNum) ? { email: emailOrNum } : { phone: emailOrNum };



    const user = await RegisterModel.findOne(userFindInstant);


    if (!user) {
      return errorHelper(res, { message: "User not found", status: 422 });
    }

    // ----for email only
    const otp = Math.floor(100000 + Math.random() * 900000);

    console.log(`your otp is:----> ${otp}`);

    const transportInstance = nodeMailerOtpHelper(
      emailOrNum,
      "Email Verification Otp",
      `Your email verification Opt is:- ${otp}`
    );

    if (!transportInstance) {
      return errorHelper(res, { message: "Error sending OTP", status: 500 });
    }

    await OtpModel.findOneAndUpdate(
      { emailOrNum: emailOrNum },
      { otp },
      { upsert: true, new: true }
    );

    return successHelper(res, "Otp Sent Successfully", 200);
  } catch (err) {
    return errorHelper(res, err);
  }
};


// ---------------------reset password

const verifyOtpForPassword=async(req,res)=>{

  try{

    const { otp, emailOrNum } = req.body;

    const rules={
      otp: "required",
      emailOrNum: "required",
    }
    const validationCheck = await validatorHelper(req.body, rules);

    if(!validationCheck.success){

      return errorHelper(res,validationCheck.errors);

    }


    // const typeConversion =
    // typeof emailOrNum === "string" && emailOrNum?.includes("@")
    //     ? emailOrNum
    //     : parseInt(emailOrNum,10);


        const verifiedOtp=await OtpModel.findOne({$and:[{otp},{emailOrNum:emailOrNum}]});

        if(!verifiedOtp){

          return errorHelper(res,{message:"Invalid OTP",status:422});

        }

        return successHelper(res,"Otp Verified",200);


  }catch(err){

    return errorHelper(res,err);
  }

}

// -------------get new password to reset password


const resetPassword=async(req,res)=>{

  try{

    const {newPassword,confirmNewPass,emailOrNum}=req.body;

    const rules={
      newPassword: "required",
      confirmNewPass: "required",
      emailOrNum: "required",
    }

    const validationCheck = await validatorHelper(req.body, rules);

    if(!validationCheck.success){

      return errorHelper(res,validationCheck.errors);

    }



    if (newPassword !== confirmNewPass) {
      return errorHelper(res, {
        message: "New Password and Confirm Password do not match",
        status: 422,
      });
    }

    const obj=isNaN(emailOrNum) ? {email:emailOrNum} : {phone:emailOrNum}

    const passEnc = await bcrypt.hash(newPassword, 10);

    const confirmedPass = await RegisterModel.findOneAndUpdate(
      obj,
      { $set: { password: passEnc } },
      { new: true }
    );

    return successHelper(
      res,
      "Password changed successfully",
      200,
      confirmedPass
    );


  }catch(err){
    return errorHelper(res,err);
  }


}





export { register, login,loginOtpVerification,changePassword,forgotPassword,verifyOtpForPassword,resetPassword };
