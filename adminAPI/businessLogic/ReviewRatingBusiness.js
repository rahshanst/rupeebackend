const logger = require("../../utils/logger");
const ReviewRatingServices = require("../services/ReviewRatingServices");
module.exports.getRatingsReviewsDetails = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    logger.info(req.body);
    try {
      const result = await ReviewRatingServices.getRatingsReviewsDetails();
      if (result.error) {
        resolve({
          status: "500",
          data: [],
          error: result.error.info,
          message: "Internal server error",
        });
      }
      if (result.recordset.length > 0) {
        resolve({
          status: "200",
          data: result.recordset,
          message: "Record fetched successfully",
        });
      } else {
        resolve({
          status: "404",
          data: [],
          message: "No result found",
        });
      }
    } catch (error) {
      logger.info("Error making API request:", error);
      resolve({
        status: "500",
        data: [],
        error,
        message: error.code,
      });
    }
  });
};
module.exports.getRatingsReviewsDtlsById = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    logger.info(req.body);
    try {
      const result = await ReviewRatingServices.getRatingsReviewsDtlsById();
      if (result.error) {
        resolve({
          status: "500",
          data: [],
          error: result.error.info,
          message: "Internal server error",
        });
      }
      if (result.recordset.length > 0) {
        resolve({
          status: "200",
          data: result.recordset,
          message: "Record fetched successfully",
        });
      } else {
        resolve({
          status: "404",
          data: [],
          message: "No result found",
        });
      }
    } catch (error) {
      logger.info("Error making API request:", error);
      resolve({
        status: "500",
        data: [],
        error,
        message: error.code,
      });
    }
  });
};
