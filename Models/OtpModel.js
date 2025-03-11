import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema(
  {
    emailOrNum: { type: String, required: true },
    otp: { type: Number, required: true },
    expireAt: { type: Date, default: () => Date.now() + 5 * 60 * 1000 },
  },
  {
    timestamps: true,
  }
);

OtpSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

const OtpModel = mongoose.model("Otp", OtpSchema);

export default OtpModel;


// --------------------------------


