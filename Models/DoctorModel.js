import mongoose from "mongoose";
import bcrypt from "bcrypt";

const appointments = new mongoose.Schema({
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
});

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    mobile_number: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    qualification: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    profile_pic: {
      type: Array,
    },
    slots: {
      sunday: [appointments],
      monday: [appointments],
      tuesday: [appointments],
      wednesday: [appointments],
      thursday: [appointments],
      friday: [appointments],
      saturday: [appointments],
    },
  },
  {
    timestamps: true,
  }
);

// this code will run before data storing in mongo db database and it will bcrypt password.
doctorSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);

    next();
  } catch (error) {
    next(error);
  }
});

const DoctorModel = mongoose.model("Doctor", doctorSchema);

export default DoctorModel;
