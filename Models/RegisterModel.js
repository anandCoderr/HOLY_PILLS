import mongoose from "mongoose";
import bcrypt from "bcrypt";

const registerSchema = new mongoose.Schema(
  {
    profileImg: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// this code will run before data storing in mongo db database and it will bcrypt password.
registerSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);

    next();
  } catch (error) {
    next(error);
  }
});

const RegisterModel = mongoose.model("register", registerSchema);

export default RegisterModel;
