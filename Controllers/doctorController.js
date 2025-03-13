import DoctorModel from "../Models/DoctorModel.js";

import {
  successHelper,
  errorHelper,
  validatorHelper,
} from "../Helper/globalHelper.js";

const doctorRegistrations = async (req, res) => {
  try {
    const {
      name,
      gender,
      mobileNumber,
      email,
      specialization,
      qualification,
      experience,
      password,
    } = req.body;

    let profilePic = req.file === undefined || req.file === "" ? [] : req.file;

    const rules = {
      name: "required",
      gender: "required",
      email: "required",
      password: "required",
      mobileNumber: "required",
      specialization: "required",
      qualification: "required",
      experience: "required",
    };

    const validationCheck = await validatorHelper(req.body, rules);

    if (!validationCheck.success) {
      console.log("validationCheck.errors", validationCheck.errors);

      return errorHelper(res, validationCheck.errors);
    }

    // -------------checking existed doctor via mail and number

    const isExisted = await DoctorModel.findOne({
      $or: [{ email }, { mobile_number: mobileNumber }],
    });

    if (isExisted) {
      return errorHelper(res, { message: "Doctor already exist", status: 422 });
    }

    const saveDoc = DoctorModel({
      name,
      gender,
      mobile_number: mobileNumber,
      email,
      specialization,
      qualification,
      experience,
      password,
      profile_pic: profilePic,
    });

    await saveDoc.save();

    return successHelper(res, "Doctor registered successfully", 201, saveDoc);
  } catch (err) {
    errorHelper(res, err);
  }
};

// ---- block doctor

const blockDoctor = async (req, res) => {
  try {
    const { id } = req.query;

    const doctor = await DoctorModel.findByIdAndUpdate(
      id,
      { status: false },
      { new: true }
    );

    if (!doctor) {
      return errorHelper(res, { message: "Doctor not found", status: 422 });
    }

    return successHelper(res, "Doctor blocked successfully", 200, doctor);
  } catch (err) {
    errorHelper(res, err);
  }
};

// --------get all doctor

const getAllDoctor = async (req, res) => {
  try {
    const doctor = await DoctorModel.find({ status: true }).select("-password");

    return successHelper(res, "All Doctor", 200, doctor);
  } catch (err) {
    return errorHelper(res, err);
  }
};

// ----------get Specific doctor information

const getDoctorInfo = async (req, res) => {
  try {
    const { id } = req.query;

    const doctor = await DoctorModel.findById(id).select("-password");

    if (!doctor) {
      return errorHelper(res, { message: "Doctor not found", status: 422 });
    }

    return successHelper(res, "Doctor information", 200, doctor);
  } catch (err) {
    errorHelper(res, err);
  }
};

// ---set appointments to a doctor:

const setAppointments = async (req, res) => {
  try {
    const { id, slotId, day } = req.query;
    const { startDate, endDate } = req.body;

    if (id && slotId && day) {
      // Use `$pull` to remove the object from the specified day's array
      const doctor = await DoctorModel.findByIdAndUpdate(
        id,
        { $pull: { [`slots.${day}`]: { _id: slotId } } },
        { new: true }
      );

      if (!doctor) {
        return errorHelper(res, { message: "Doctor not found", status: 422 });
      }

      // Step 2: Check if the array is empty and remove the field
      if (doctor.slots[day] && doctor.slots[day].length === 0) {
        await DoctorModel.findByIdAndUpdate(
          id,
          { $unset: { [`slots.${day}`]: "" } }, // Removes the empty array field
          { new: true }
        );
      }

      return successHelper(
        res,
        "Appointments removed successfully",
        200,
        doctor
      );
    }

    // Validate inputs
    const rule = {
      startDate: "required",
      endDate: "required",
    };
    const validationCheck = await validatorHelper(req.body, rule);

    if (!validationCheck.success) {
      return errorHelper(res, validationCheck.errors);
    }

    const today = new Date();
    const startDateObj = new Date(
      `${today.toISOString().split("T")[0]}T${startDate}:00.000Z`
    );
    const endDateObj = new Date(
      `${today.toISOString().split("T")[0]}T${endDate}:00.000Z`
    );

    const doctor = await DoctorModel.findByIdAndUpdate(
      id,
      {
        $push: {
          [`slots.${day}`]: {
            startDate: startDateObj,
            endDate: endDateObj,
          },
        },
      },
      {
        new: true,
        upsert: true,
      }
    );

    if (!doctor) {
      return errorHelper(res, { message: "Doctor not found", status: 422 });
    }

    return successHelper(res, "Appointments set successfully", 200, doctor);
  } catch (err) {
    errorHelper(res, err);
  }
};

export {
  doctorRegistrations,
  blockDoctor,
  getAllDoctor,
  getDoctorInfo,
  setAppointments,
};
