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

      const newReviewData = await newReview.save();

      apiResponse.successResponseWithData(res, "Successfully review added", {
        review: newReviewData,
      });
    } catch (e) {
      console.log(e);
      apiResponse.errorResponse(res, "Error while creating review");
    }
  },
];

exports.getReview = [
  async (req, res) => {
    const { task_id } = req.params;

    try {
      const reviews = await Review.find({ task: task_id });
      return apiResponse.successResponseWithData(
        res,
        "Reviews fetched",
        reviews
      );
    } catch (e) {
      if (e) {
        return apiResponse.errorResponse(res, e.message);
      }
    }
  },
];
