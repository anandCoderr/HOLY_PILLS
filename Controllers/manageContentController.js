import contentModel from "../Models/ManageContentModel.js";
import {
  successHelper,
  errorHelper,
  validatorHelper,
} from "../Helper/globalHelper.js";

const setContent = async (req, res) => {
  const {
    banner,
    bannerImg,
    whatIs,
    commonSignsAndSymptoms,
    features,
    whatCause,
    howToManage,
    howToManageImg,
    reduceSymptom,
  } = req.body;

  const rules = {
    banner: "required",
    bannerImg: "required",
    whatIs: "required",
    commonSignsAndSymptoms: "required",
    features: "required",
    whatCause: "required",
    howToManage: "required",
    howToManageImg: "required",
    reduceSymptom: "required",
  };

  const validationCheck = await validatorHelper(req.body, rules);

  if (!validationCheck.success) {
    return errorHelper(res, validationCheck.errors);
  }

  try {
    const content = new contentModel({
      banner,
      bannerImg,
      whatIs,
      commonSignsAndSymptoms,
      features,
      whatCause,
      howToManage,
      howToManageImg,
      reduceSymptom,
    });

    await content.save();

    return successHelper(res, "Content added successfully", 201, content);
  } catch (err) {
    return errorHelper(res, err);
  }
};



export default setContent;

