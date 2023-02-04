var Review = require("../models/Reviews");
const { body, validationResult } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");

exports.createReview = [
  async (req, res) => {
    const { review, id } = req.body;

    try {
      const newReview = new Review({
        description: review,
        reviwed_by: req.user._id,
        task: id,
      });

      await newReview.save();
      apiResponse.successResponse(res, "Successfully review added");
    } catch (e) {
      console.log(e);
      apiResponse.errorResponse(res, "Error while creating review");
    }
  },
];
