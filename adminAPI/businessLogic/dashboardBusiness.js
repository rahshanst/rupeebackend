const dashboardServices = require("../services/dashboardServices");
const adminServices = require("../../api/services/adminservices");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const logger = require("../../utils/logger");
const dayjs = require("dayjs");
const { uploadFilesToBlob } = require("../../utils/azureBlobFile");

module.exports.getDashboardCount = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    const { bankName, ticketModule } = req.body;
    let condition;
    try {
      //   if (bankName === "" && ticketModule === "") {
      //     // No condition needed
      //     condition = '';
      // } else if (bankName !== "" && ticketModule === "") {
      //     // Only bank_name is specified
      //     condition = ` bank_name = '${bankName}'`;
      // } else if (bankName === "" && ticketModule !== "") {
      //     // Only ticketModule is specified
      //     condition = ` ticket_module = '${ticketModule}'`;
      // } else {
      //     // Both bank_name and ticketModule are specified
      //     condition = ` bank_name = '${bankName}' AND ticket_module = '${ticketModule}'`;
      // }
      const dashboardData = await dashboardServices.getDashboardCount(
        condition
      );
      logger.info(dashboardData.recordset, dashboardData.recordset.length);
      resolve({
        status: "200",
        data: dashboardData.recordset,
        message: "Record fetched successfully",
      });
    } catch (error) {
      logger.info("Error making API request:", error.message);
      resolve({
        status: "500",
        data: [],
        error,
        message: error.code,
      });
    }
  });
};

module.exports.getConstantValue = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      let bankNames = await dashboardServices.getBankNames();
      // let providerNames = await dashboardServices.getProviderNames();
      // let airPortName = await dashboardServices.getAirPortName();
      // let hotelNames = await dashboardServices.getHotelNames();
      // let locationData = await dashboardServices.getHotelLocation();

      // logger.info([bankNames.recordset, providerNames.recordset]);
      resolve({
        status: "200",
        data: {
          bankNames: bankNames.recordset,
          // providerNames: providerNames.recordset,
          // airPortNames: airPortName.recordset,
          // hotelNames: hotelNames.recordset,
          // hotelLocation: locationData.recordset,
        },
        message: "Record fetched successfully",
      });
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

module.exports.getAdminConstantValue = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      let bankNames = await dashboardServices.getBankNames();
      logger.info([bankNames.recordset]);
      resolve({
        status: "200",
        data: {
          bankNames: bankNames.recordset,
        },
        message: "Record fetched successfully",
      });
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
module.exports.addBankConfig = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      let isExistRecord = await dashboardServices.getBankConfig(req.body);
      let result;
      if (isExistRecord.recordset.length) {
        result = await dashboardServices.updateBankConfig(req.body);
        resolve({
          status: "200",
          data: {
            result,
          },
          message: "Success",
          updated: true,
        });
      } else {
        result = await dashboardServices.addBankConfig(req.body);
        logger.info([result]);
        resolve({
          status: "200",
          data: {
            result,
          },
          message: "Success",
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

module.exports.updateBankConfig = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await dashboardServices.updateBankConfig(req.body);
      logger.info([result]);
      resolve({
        status: "200",
        data: {
          result,
        },
        message: "Success",
      });
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

module.exports.getBankConfig = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      let bankData = await dashboardServices.getBankConfig(req.body);
      let result = await dashboardServices.getComercialConfigBySectionName(
        req.body
      );
      let bannerList = await dashboardServices.getBannerFile(req.body);
      const imgList = bannerList?.recordset?.map((item) => ({
        id: `1-img-${item.id}`,
        img: item.file_data,
        name: item.file_name,
      }));
      logger.info({ bankData, ...result.recordset[0] });
      resolve({
        status: "200",
        data:
          { imgList, ...bankData.recordset[0], ...result.recordset[0] } || [],
        message: "Success",
      });
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

module.exports.addBannerFile = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { file_data, file_name, ticketModule, file_type } = req.body;
      const timestamp = dayjs().format("DDMMYYYYHmmss"); // Get current timestamp

      console.log({ file_data, file_name, ticketModule });
      // Format the data with timestamp
      const buffer = Buffer.from(file_data, "base64");

      const fileName = file_name.split(".");
      console.log({ fileName });

      console.log({ buffer });

      // const fileResult = await uploadFile(buffer, `${fileName[0]}_${timestamp}.${fileName[1]}`, ticketModule, file_type)
      // console.log({ fileResult });
      let result = await dashboardServices.addBannerFile(req.body);

      // logger.info([result]);
      resolve({
        status: "200",
        data: result,
        message: "Success",
      });
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

module.exports.deleteBannerFile = async (req, res) => {
  console.log("aaa", req.body);
  return new Promise(async (resolve, reject) => {
    try {
      let result = await dashboardServices.deleteBannerFile(req.body);
      logger.info([result]);
      resolve({
        status: "200",
        data: result.recordset || [],
        message: "Success",
      });
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

module.exports.getBannerFile = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await dashboardServices.getBannerFileAdmin({
        ticketModule: "banners",
      });
      logger.info([result]);
      resolve({
        status: "200",
        data: result.recordset || [],
        message: "Success",
      });
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

module.exports.addComercialConfig = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(req.body);

      const isRecordExist = await dashboardServices.getRecordBySectionName(
        req.body.sectionName
      );
      console.log({ isRecordExist });
      if (isRecordExist.recordset.length > 0) {
        const updatedRecord = await dashboardServices.updateComercialConfig(
          req.body
        );
        resolve({
          status: "200",
          data: updatedRecord.recordset || [],
          message: "Record Updated",
        });
      } else {
        let result = await dashboardServices.addComercialConfig(req.body);
        logger.info([result]);
        resolve({
          status: "200",
          data: result.recordset || [],
          message: "Success",
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

module.exports.updateComercialConfig = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await dashboardServices.updateComercialConfig(req.body);
      logger.info([result]);
      resolve({
        status: "200",
        data: result.recordset || [],
        message: "Success",
      });
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

module.exports.getAllCommercialConfig = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await dashboardServices.getAllCommercialConfig(req.body);
      logger.info([result]);
      resolve({
        status: "200",
        data: result.recordset || [],
        message: "Success",
      });
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

module.exports.getAllCommercialConfig = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await dashboardServices.getAllCommercialConfig(req.body);
      logger.info([result]);
      if (result.error) {
        resolve({
          status: "500",
          data: [],
          error: result.error.info,
          message: "Internal server error",
        });
      }
      resolve({
        status: "200",
        data: result.recordset || [],
        message: "Success",
      });
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

module.exports.getBrands = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await dashboardServices.getBrands(req.body);
      logger.info([result]);
      if (result.error) {
        resolve({
          status: "500",
          data: [],
          error: result.error.info,
          message: "Internal server error",
        });
      }
      resolve({
        status: "200",
        data: result.recordset || [],
        message: "Success",
      });
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

// Method to get deals
module.exports.getDeals = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await dashboardServices.getDeals(req.body);
      logger.info([result]);
      if (result.error) {
        resolve({
          status: "500",
          data: [],
          error: result.error.info,
          message: "Internal server error",
        });
      }
      resolve({
        status: "200",
        data: result.recordset || [],
        message: "Success",
      });
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

// Method to get categories
module.exports.getCategories = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await dashboardServices.getCategoryDetails(req.body);
      logger.info([result]);
      if (result.error) {
        resolve({
          status: "500",
          data: [],
          error: result.error.info,
          message: "Internal server error",
        });
      }
      resolve({
        status: "200",
        data: result.recordset || [],
        message: "Success",
      });
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

module.exports.getTransaction = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await dashboardServices.getTransactionDetails(req.body);
      logger.info([result]);
      if (result.error) {
        resolve({
          status: "500",
          data: [],
          error: result.error.info,
          message: "Internal server error",
        });
      }
      resolve({
        status: "200",
        data: result.recordset || [],
        message: "Success",
      });
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
module.exports.getDetalsDetails = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await dashboardServices.getAllDeals(req.body);
      logger.info([result]);
      if (result.error) {
        resolve({
          status: "500",
          data: [],
          error: result.error.info,
          message: "Internal server error",
        });
      }
      resolve({
        status: "200",
        data: result.recordset || [],
        message: "Success",
      });
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

// Method to add brands
module.exports.addBrands = async (req, res) => {
  const uuid = uuidv4();
  let datas = { uuid, ...req.body };
  return new Promise(async (resolve, reject) => {
    try {
      let result = await dashboardServices.createBrand(datas);
      logger.info([result]);
      if (result.error) {
        resolve({
          status: "500",
          data: [],
          error: result.error.info,
          message: "Internal server error",
        });
      }
      resolve({
        status: "200",
        data: result.recordset || [],
        message: "Success",
      });
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

let sizeImage = {
  offer_banner_sm: "banner_sm",
  offer_banner_xl: "banner_xl",
  offer_banner_lg: "banner_lg",
};

// Method to add deals
module.exports.addDeals = async (req, res) => {
  const uuid = uuidv4();
  let ticketModule = "",
    fileResultXl = "",
    fileResultLg = "",
    fileResultSm = "";
  const timestamp = dayjs().format("DDMMYYYYHmmss"); // Get current timestamp
  return new Promise(async (resolve, reject) => {
    try {
      const { offer_banner_sm, offer_banner_lg, offer_banner_xl, ...rest } =
        req.files;

      // if (offer_banner_sm) {
      //   ticketModule = sizeImage["offer_banner_sm"];
      //   fileResultSm = await uploadFilesToBlob({
      //     ...req.body,
      //     ...req.files,
      //     timestamp,
      //     folder: "Deals",
      //     file_data:offer_banner_sm,
      //     ticketModule,
      //   });
      // }
      // if (offer_banner_lg) {
      //   ticketModule = sizeImage["offer_banner_lg"];
      //   fileResultLg = await uploadFilesToBlob({
      //     ...req.body,
      //     ...req.files,
      //     timestamp,
      //     timestamp,
      //     folder: "Deals",
      //     file_data:offer_banner_lg,
      //     ticketModule,
      //   });
      // }
      // if (offer_banner_xl) {
      //   ticketModule = sizeImage["offer_banner_xl"];
      //   fileResultXl = await uploadFilesToBlob({
      //     ...req.body,
      //     ...req.files,
      //     timestamp, folder: "Deals",
      //     file_data:offer_banner_xl,
      //     folder: "Deals",
      //     ticketModule,
      //   });
      // }
      // console.log(
      //   fileResultLg[0]?.url,fileResultSm?.url,fileResultXl?.url
      // );
      let result = await adminServices.addOffer({
        ...req.body,
        // offer_banner_sm: fileResultSm[0]?.url,
        // offer_banner_lg: fileResultLg[0]?.url,
        // offer_banner_xl: fileResultXl[0]?.url,
      });
      logger.info([result]);
      if (result.error) {
        resolve({
          status: "500",
          data: [],
          error: result.error.info,
          message: "Internal server error",
        });
      }
      resolve({
        status: "200",
        data: result.recordset || [],
        message: "Success",
      });
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

module.exports.updateDeals = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(req.body);
      let result = await dashboardServices.updateDealById(req.body);
      logger.info([result]);
      if (result.error) {
        resolve({
          status: "500",
          data: [],
          error: result.error.info,
          message: "Internal server error",
        });
      }
      resolve({
        status: "200",
        data: result.recordset || [],
        message: "Success",
      });
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

module.exports.getDealsById = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await dashboardServices.getDealById(req.body.id);
      logger.info([result]);
      if (result.error) {
        resolve({
          status: "500",
          data: [],
          error: result.error.info,
          message: "Internal server error",
        });
      }
      resolve({
        status: "200",
        data: result.recordset || [],
        message: "Success",
      });
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

module.exports.deleteDealsById = async (req, res) => {
  const uuid = uuidv4();
  let deals = { uuid, ...req.body };
  return new Promise(async (resolve, reject) => {
    try {
      let result = await dashboardServices.deleteDealById(req.body.id);
      let id_offer_set = await adminServices.getCouponIdByOfferId({
        id: req.body.id,
      });
      const id_offer = id_offer_set?.recordset[0]?.coupon_id;
      await adminServices.deleteCouponOfferById({
        id_offer: id_offer,
      });
      logger.info([result]);
      if (result.error) {
        resolve({
          status: "500",
          data: [],
          error: result.error.info,
          message: "Internal server error",
        });
      }
      resolve({
        status: "200",
        data: result.recordset || [],
        message: "Success",
      });
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

// Method to add categories
module.exports.addCategories = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await dashboardServices.addCategories(req.body);
      logger.info([result]);
      if (result.error) {
        resolve({
          status: "500",
          data: [],
          error: result.error.info,
          message: "Internal server error",
        });
      }
      resolve({
        status: "200",
        data: result.recordset || [],
        message: "Success",
      });
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

// Method to update brands
module.exports.updateBrands = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(req.body);
      let result = await dashboardServices.updateBrandById(req.body);
      logger.info([result]);
      if (result.error) {
        resolve({
          status: "500",
          data: [],
          error: result.error.info,
          message: "Internal server error",
        });
      }
      resolve({
        status: "200",
        data: result.recordset || [],
        message: "Success",
      });
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

module.exports.deleteBrandsById = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await dashboardServices.deleteBrandById(req.body.id);
      logger.info([result]);
      if (result.error) {
        resolve({
          status: "500",
          data: [],
          error: result.error.info,
          message: "Internal server error",
        });
      }
      resolve({
        status: "200",
        data: result.recordset || [],
        message: "Success",
      });
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

module.exports.getBrandById = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await dashboardServices.getBrandById(req.body.id);
      logger.info([result]);
      if (result.error) {
        resolve({
          status: "500",
          data: [],
          error: result.error.info,
          message: "Internal server error",
        });
      }
      resolve({
        status: "200",
        data: result.recordset || [],
        message: "Success",
      });
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

// Method to update categories
module.exports.updateCategories = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await dashboardServices.updateCategories(req.body);
      logger.info([result]);
      if (result.error) {
        resolve({
          status: "500",
          data: [],
          error: result.error.info,
          message: "Internal server error",
        });
      }
      resolve({
        status: "200",
        data: result.recordset || [],
        message: "Success",
      });
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

// Method to update banners
module.exports.updateBanners = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await dashboardServices.updateBannerById(req.body);
      logger.info([result]);
      if (result.error) {
        resolve({
          status: "500",
          data: [],
          error: result.error.info,
          message: "Internal server error",
        });
      }
      resolve({
        status: "200",
        data: result.recordset || [],
        message: "Success",
      });
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

module.exports.searchTransactions = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await dashboardServices.searchTransactions(req.body.val);
      logger.info([result]);
      if (result.error) {
        resolve({
          status: "500",
          data: [],
          error: result.error.info,
          message: "Internal server error",
        });
      }
      resolve({
        status: "200",
        data: result.recordset || [],
        message: "Success",
      });
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
module.exports.getBrandName = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      let brand_name = await dashboardServices.getBrandName();
      logger.info([brand_name]);
      resolve({
        status: "200",
        data: {
          brandName: brand_name.recordset,
        },
        message: "Record fetched successfully",
      });
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
module.exports.searchCategory = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await dashboardServices.searchCategory(req.body.val);
      logger.info([result]);
      if (result.error) {
        resolve({
          status: "500",
          data: [],
          error: result.error.info,
          message: "Internal server error",
        });
      }
      resolve({
        status: "200",
        data: result.recordset || [],
        message: "Success",
      });
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

module.exports.filterByBrand = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await dashboardServices.filterByBrand(req.body);
      logger.info([result]);
      if (result.error) {
        resolve({
          status: "500",
          data: [],
          error: result.error.info,
          message: "Internal server error",
        });
      }
      resolve({
        status: "200",
        data: result.recordset || [],
        message: "Success",
      });
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
module.exports.searchDeals = async (req, res) => {
  console.log(req.body);
  return new Promise(async (resolve, reject) => {
    try {
      let result = await dashboardServices.searchDeals(req.body.val);
      logger.info([result]);
      if (result.error) {
        resolve({
          status: "500",
          data: [],
          error: result.error.info,
          message: "Internal server error",
        });
      }
      resolve({
        status: "200",
        data: result.recordset || [],
        message: "Success",
      });
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
