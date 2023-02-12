const Alerts = require("../models/Alerts");
const apiResponse = require("../helpers/apiResponse");

module.exports.getUserAlerts = [
  async (req, res) => {
    const { id } = req.params;

    const alerts = await Alerts.find({ generated_to: id });
    if (!alerts.length) {
      return apiResponse.errorResponse(res, "No alerts found");
    }
    return apiResponse.successResponseWithData(
      res,
      "Alerts successfully fetched",
      alerts
    );
  },
];

module.exports.setAlertSeen = [
  async (req, res) => {
    const { id } = req.params;
    const modified = await Alerts.updateOne({ _id: id }, { seen: true });
    if (!modified) {
      return apiResponse.errorResponse(res, "Unable to read this message");
    }
    return apiResponse.successResponseWithData(
      res,
      "Alerts updated successfully",
      true
    );
  },
];
