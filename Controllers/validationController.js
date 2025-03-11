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
    const { name, email, password, phone, avatarImg } = req.body;

    const rules = {
      name: "required|min:3",
      email: "required|email",
      password: "required",
      phone: "required",
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

    return successHelper(res, "User Login Successfully", 200, {
      user,
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
    var token = jwt.sign({ userId: checkUser._id }, process.env.SECREAT_KEY);

    return successHelper(res, "User Login Successfully", 200, {
      user: checkUser,
      token: token,
    });
  } catch (err) {
    return errorHelper(res, err);
  }
};

export { register, login,loginOtpVerification };
