const logger = require("../../utils/logger");
const activeOffersServices = require("../services/activeOffersServices");
module.exports.getActiveOfferDetails = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    logger.info(req.body);
    try {
      const result = await activeOffersServices.getActiveOfferDetails();
      if (result.error) {
        resolve({
          status: "500",
          data: [],
          error: result.error.info,
          message: "Internal server error",
        });
      }
      logger.info(result.recordset)
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
module.exports.getActiveOfferDtlsById = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    logger.info(req.body);
    try {
      const result = await activeOffersServices.getActiveOfferDtlsById();
      if (result.error) {
        resolve({
          status: "500",
          data: [],
          error: result.error.info,
          message: "Internal server error",
        });
      }
      logger.info(result.recordset)
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
