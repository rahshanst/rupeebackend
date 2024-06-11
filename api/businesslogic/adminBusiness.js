// controllers/TripController.js
const adminServices = require("../services/adminservices");
const { v4: uuidv4 } = require("uuid");
const { uploadFilesToBlob } = require("../../utils/azureBlobFile");
const dayjs = require("dayjs");
const logger = require("../../utils/logger");
const timestamp = dayjs().format("DDMMYYYYHmmss"); // Get current timestamp
const { Readable } = require("stream");
const xlsx = require("xlsx");

const csv = require("csv-parser");
const fs = require("fs");
const os = require("os");
const path = require("path");

/*const {
  GET_PWA_REWARDS,
  GET_PWA_WALLET_POINTS,
  REFUND_POINTS,
  DEDUCT_WALLET_POINTS,
  GET_TOKEN,
  REFRESH_TOKEN,
} = require("../flightConstants");
*/
/*const getTrips = (req, res) => {
  return new Promise((resolve, reject) => {
    tripServices.getTrips().then((result) => {
      if (result[0]) {
        resolve({
          status: "200",
          data: result[0],
          message: "Fetched Successfully",
        });
      } else {
        resolve({
          status: "404",
          data: [],
          message: "Data not found.",
        });
      }
    });
  });
};

const getTripById = (req, res) => {
  return new Promise((resolve, reject) => {
    logger.info("req.body.id", req.body.tripId);
    tripServices.getTrip(req.body.tripId).then((result) => {
      if (result[0]) {
        resolve({
          status: "200",
          data: result[0],
          message: "Fetched Successfully",
        });
      } else {
        resolve({
          status: "404",
          data: [],
          message: "Data not found.",
        });
      }
    });
  });
};

const addTrip = (req, res) => {
  return new Promise((resolve, reject) => {
    let Trip = { ...req.body };
    tripServices.addTrip(Trip).then((result) => {
      if (result) {
        resolve({
          status: "200",
          data: result,
          message: "Data inserted Successfully",
        });
      }
      resolve({
        status: "400",
        data: result,
        message: "Unable to insert record",
      });
    });
  });
};
*/
/*
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../../uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage })
*/

const addCategory = async (req, res) => {
  try {
    return await new Promise(async (resolve, reject) => {
      let incomingData = { ...req.body };
      logger.info(`Beofre timestamp ${timestamp}`);
      // logger.info({ incomingData });
      logger.info({ timestamp });
      const folder = "category";
      logger.info({
        timestamp,
        folder,
      });
      const fileResult = await uploadFilesToBlob({
        ...req.body,
        ...req.files,
        timestamp,
        folder,
      });
      logger.info({ fileResult });

      logger.info(
        `Executing query ${{
          ...req.body,
          file_data: fileResult[0]?.url || "",
        }}`
      );
      adminServices
        .addCategory({ ...req.body, file_data: fileResult[0]?.url || "" })
        .then((result) => {
          if (result) {
            resolve({
              status: 200,
              fileResult: fileResult || [],
              message: "Data Added Successfully",
            });
          } else {
            resolve({
              status: 500,
              fileResult: [],
              message: `${result}`,
            });
          }
        })
        .catch((err) => {
          logger.info(`bb ${err}`);
          resolve({
            status: 500,
            data: [],
            message: `${err}`,
          });
        });
    });
  } catch (err_1) {
    logger.info(`catch ${err_1}`);
    resolve({
      status: 500,
      data: [],
      message: `${err_1}`,
    });
  }
};
const updateCategory = (req, res) => {
  return new Promise(async (resolve, reject) => {
    let incomingData = { ...req.body };
    const timestamp = dayjs().format("DDMMYYYYHmmss"); // Get current timestamp
    const folder = "category";
    console.log( typeof req.files);
    // return
    let file_value = "";
    let fileResult ="";
      //console.log("fille", req.body.file_data);
      if(typeof req.body.file_data == "string"){
        file_value = req.body.file_data;
      }
      else{
        fileResult = await uploadFilesToBlob({
          ...req.body,
          ...req.files,
          timestamp,
          folder,
        });
        logger.info({ fileResult });

        file_value = fileResult[0]?.url

      }
  
        logger.info(
          `Executing query ${{
            ...req.body,
            file_data: file_value,
          }}`
        );
    adminServices
      .updateCategory({ ...req.body, file_data: file_value })
      .then((result) => {
        if (result) {
          resolve({
            status: 200,
            fileResult: fileResult? fileResult : file_value || [],

            message: "Data Added Successfully",
          });
        }
        resolve({
          status: 400,
          data: result,
          message: "Unable to insert record",
        });
      });
  });
};
const getCategoryById = (req, res) => {
  return new Promise(async (resolve, reject) => {
    let incomingData = { ...req.body };

    let result = await adminServices.getCategoryById(incomingData);

    if (result) {
      resolve({
        status: 200,
        data: result?.recordsets,
        message: " Success",
      });
    } else {
      resolve({
        status: 404,
        message: "No data found",
      });
    }
  });
};
const deleteCategoryById = (req, res) => {
  return new Promise(async (resolve, reject) => {
    let incomingData = { ...req.body };

    let result = await adminServices.deleteCategoryById(incomingData);

    if (result) {
      resolve({
        status: 200,
        data: result?.recordsets,
        message: " Success",
      });
    } else {
      resolve({
        status: 404,
        message: "No data found",
      });
    }
  });
};

async function handleExcelFile(file, id_offer,type,id) {
  const tempFileName = `${Date.now()}_${file[0]?.originalname}`;
  logger.info({ tempFileName });
  const tempFilePath = path.join(os.tmpdir(), tempFileName);
  logger.info({ tempFilePath }); // Check temporary file path
  fs.writeFileSync(tempFilePath, file[0].buffer);
  const buffer = fs.readFileSync(tempFilePath);
  logger.info({ buffer });
  const workbook = xlsx.read(buffer, { type: "buffer" });
  const sheet_name_list = workbook.SheetNames;
  const results = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

  logger.info({ results });

  if (type == 'update') {
    const offerId = await adminServices.getCouponIdByOfferId({ id: id })
    logger.info({ offerId }, offerId?.recordset[0]?.coupon_id);
    for (const row of results) {
      logger.info({ offerId }, row);
      if ('__EMPTY' in row) {
        // Fetch the next row if it exists
        const nextRowIndex = results.indexOf(row) + 1;
        if (nextRowIndex < results.length) {
          const nextRow = results[nextRowIndex];
          const brand_name = nextRow['__EMPTY'] || 'Brand Name';
          const coupon_code = nextRow['Coupon Code'] || nextRow['__EMPTY_1'];
          const is_active = nextRow['Active'] || nextRow['__EMPTY_2'];
    
          await adminServices.updateCouponOfferById({
            id_offer: offerId?.recordset[0]?.coupon_id,
            brand_name: brand_name,
            coupon_code: coupon_code,
            is_active: is_active || 0,
          });
        }
      } else {
        const brand_name = row['__EMPTY'] || 'Brand Name';
        const coupon_code = row['Coupon Code'] || row['__EMPTY_1'];
        const is_active = row['Active'] || row['__EMPTY_2'];
    
        await adminServices.addCoupon({
          id_offer: id_offer,
          brand_name: brand_name,
          coupon_code: coupon_code,
          is_active: is_active || 0,
        });
      }
    }
    
  } else {
    console.log({ id_offer }, results);

    for (const row of results) {
      logger.info({ id_offer }, row);
    
      if ('__EMPTY' in row) {
        // Fetch the next row if it exists
        const nextRowIndex = results.indexOf(row) + 1;
        if (nextRowIndex < results.length) {
          const nextRow = results[nextRowIndex];
          const brand_name = nextRow['__EMPTY'] || nextRow['Brand Name'];
          const coupon_code = nextRow['Coupon Code'] || nextRow['__EMPTY_1'];
          const is_active = nextRow['Active'] || nextRow['__EMPTY_2'];
    
          await adminServices.addCoupon({
            id_offer: id_offer,
            brand_name: brand_name,
            coupon_code: coupon_code,
            is_active: is_active || 0,
          });
        }
      } else {
        const brand_name = row['__EMPTY'] || row['Brand Name'];
        const coupon_code = row['Coupon Code'] || row['__EMPTY_1'];
        const is_active = row['Active'] || row['__EMPTY_2'];
    
        await adminServices.addCoupon({
          id_offer: id_offer,
          brand_name: brand_name,
          coupon_code: coupon_code,
          is_active: is_active || 0,
        });
      }
    }
    
  }
}

async function handleCsvFile(file, id_offer,type) {
  const results = [];
  const readableStream = new Readable();
  readableStream.push(file.buffer);
  readableStream.push(null);

  return new Promise((resolve, reject) => {
    readableStream
      .pipe(csv({ separator: ";" }))
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        try {
          if (type == 'update') {
            const offerId = await adminServices.getCouponIdByOfferId({ id: id })
            logger.info({offerId}); 
            for (const row of results) {
              await adminServices.updateCouponOfferById({
                id_offer: offerId?.recordset[0]?.coupon_id,
                brand_name: row["Brand Name"],
                coupon_code: row["Coupon Code"],
                is_active: row["Active"],
              });
            }
          } else {
            for (const row of results) {
              await adminServices.addCoupon({
                id_offer: id_offer,
                brand_name: row["Brand Name"],
                coupon_code: row["Coupon Code"],
                is_active: row["Active"],
              });
            }
          }
          resolve();
        } catch (err) {
          console.error("Error inserting data", err);
          reject(err);
        }
      });
  });
}

const addOffer = (req, res) => {
  return new Promise(async (resolve, reject) => {
    const timestamp = dayjs().format("DDMMYYYYHmmss"); // Get current timestamp
    const id_offer = uuidv4();

    let fileurl = {};
    let ticketModule = "",
      brand_logoFile = "",
      product_picFile = "",
      couponfileFile = "";
    const {is_brand_logo, is_product_pic, is_coupon_file} = req.body
    const { brand_logo, product_pic, coupon_file } = req.files;
    logger.info({ coupon_file });
    if (is_brand_logo == '1' && brand_logo) {
      ticketModule = "brand_logo";
      brand_logoFile = await uploadFilesToBlob({
        ...req.body,
        ...req.files,
        timestamp,
        folder: "Deals",
        file_data: brand_logo,
        ticketModule,
      });
      fileurl={...fileurl,brand_logo:brand_logoFile[0]?.url}
    } else {
      fileurl={...fileurl,brand_logo:''}
    }
    logger.info({ brand_logoFile });
    if (is_product_pic == '1' && product_pic) {
      ticketModule = "product_pic";
      product_picFile = await uploadFilesToBlob({
        ...req.body,
        ...req.files,
        timestamp,
        timestamp,
        folder: "Deals",
        file_data: product_pic,
        ticketModule,
      });
      fileurl={...fileurl,product_pic:product_picFile[0]?.url}
    } else {
      fileurl={...fileurl,product_pic:''}
    }

    if (is_coupon_file == '1' && coupon_file) {
      ticketModule = "coupon_file";
      couponfileFile = await uploadFilesToBlob({
        ...req.body,
        ...req.files,
        timestamp,
        timestamp,
        folder: "couponfile",
        file_data: coupon_file,
        ticketModule,
      });
      fileurl = { ...fileurl, coupon_file: couponfileFile[0]?.url }
      const fileExtension = coupon_file[0]?.originalname?.split(".")[1];
      logger.info({ fileExtension });
      if (fileExtension === "xls" || fileExtension === "xlsx") {
        await handleExcelFile(coupon_file, id_offer,'insert');
      } else if (fileExtension === "csv") {
        await handleCsvFile(coupon_file, id_offer,'insert');
      } else {
        resolve({
          status: 408,
          message: "Unsupported file",
          err: '',
        });
      }
    } else {
      fileurl={...fileurl,coupon_file:''}
    }
    logger.info(
      `Executing query ${{
        ...req.body,
        ...fileurl,
        is_brand_logo:undefined, is_product_pic:undefined, is_coupon_file:undefined,
      }}`
    );

  
    logger.info({fileurl});
    adminServices
      .addOffer({
        ...req.body,
        ...fileurl,
        coupon_id: id_offer,
        is_brand_logo:undefined, is_product_pic:undefined, is_coupon_file:undefined,
      })
      .then((result) => {
        if (result) {
          resolve({
            status: 200,
            ...fileurl,
            message: "Data Added Successfully",
          });
        }
        resolve({
          status: 400,
          data: result,
          message: "Unable to insert record",
        });
      });
  });
};

const updateOffer = (req, res) => {
  return new Promise(async (resolve, reject) => {
    const timestamp = dayjs().format("DDMMYYYYHmmss"); // Get current timestamp
    const id_offer = uuidv4();

    let fileurl = {};
    let ticketModule = "",
      brand_logoFile = "",
      product_picFile = "",
      couponfileFile = "";
    const {is_brand_logo, is_product_pic, is_coupon_file} = req.body
    const { brand_logo, product_pic, coupon_file, } = req.files;
    logger.info(is_coupon_file,{ is_coupon_file, is_coupon_file: is_coupon_file == 1 });
    logger.info({ coupon_file });
    if (is_brand_logo == '1' && brand_logo) {
      ticketModule = "brand_logo";
      brand_logoFile = await uploadFilesToBlob({
        ...req.body,
        ...req.files,
        timestamp,
        folder: "Deals",
        file_data: brand_logo,
        ticketModule,
      });
      fileurl={...fileurl,brand_logo:brand_logoFile[0]?.url}
    } else {
      fileurl={...fileurl,brand_logo:undefined}
    }
    logger.info({ brand_logoFile });
    if (is_product_pic == '1' && product_pic) {
      ticketModule = "product_pic";
      product_picFile = await uploadFilesToBlob({
        ...req.body,
        ...req.files,
        timestamp,
        timestamp,
        folder: "Deals",
        file_data: product_pic,
        ticketModule,
      });
      fileurl={...fileurl,product_pic:product_picFile[0]?.url}
    } else {
      fileurl={...fileurl,product_pic:undefined}
    }

    if (is_coupon_file == '1' && coupon_file) {
      ticketModule = "coupon_file";
      couponfileFile = await uploadFilesToBlob({
        ...req.body,
        ...req.files,
        timestamp,
        timestamp,
        folder: "couponfile",
        file_data: coupon_file,
        ticketModule,
      });
      fileurl={...fileurl,coupon_file:couponfileFile[0]?.url}
    } else {
      fileurl={...fileurl,coupon_file:undefined}
    }
    logger.info(
      `Executing query ${{
        ...req.body,
        ...fileurl,
        is_brand_logo:undefined, is_product_pic:undefined, is_coupon_file:undefined,
      }}`
    );

    const fileExtension = is_coupon_file == '1' ? coupon_file[0]?.originalname?.split(".")[1]:'';
    logger.info({ fileExtension });
    if (fileExtension === "xlsx") {
      await handleExcelFile(coupon_file, id_offer,'update',req.body.id);
    } else if (fileExtension === "csv") {
      await handleCsvFile(coupon_file, id_offer,'update',req.body.id);
    }
    logger.info({fileurl});
    adminServices
      .updateOfferById({
        ...req.body,
        ...fileurl,
        coupon_id: id_offer,
      })
      .then((result) => {
        if (result) {
          resolve({
            status: 200,
            ...fileurl,
            message: "Data Added Successfully",
          });
        }
        resolve({
          status: 400,
          data: result,
          message: "Unable to insert record",
        });
      });
  });
};

/*
const GetPwaRewards = (req, res) => {
  return new Promise(async (resolve, reject) => {
    const url = GET_PWA_REWARDS;
    logger.info(url);
    logger.info(req.headers);
    const authorizationHeader = req.headers["authorization"];
    // const Cookie = req.headers["Cookie"];
    const Cookie =
      "ARRAffinity=ef9aa2e92a300f3166dc402f37bb3d300cbcfa0e93dee478dddb346c20cc359e; ARRAffinitySameSite=ef9aa2e92a300f3166dc402f37bb3d300cbcfa0e93dee478dddb346c20cc359e";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authorizationHeader}`, // Add your authorization token here
      Cookie,
    };
    logger.info({ headers });
    try {
      const response = await axios.get(url, {
        headers,
      });
      logger.info(response.data);
      resolve({
        status: "200",
        data: response.data,
        message: "Data fetched Successfully",
      });
    } catch (error) {
      console.error("Error making API request:", error.message);
      resolve({
        status: "500",
        data: [],
        error,
        message: error.code,
      });
    }
  });
};
const GetPWAWalletPoints = (req, res) => {
  return new Promise(async (resolve, reject) => {
    const url = GET_PWA_WALLET_POINTS;
    logger.info(url);
    logger.info(req.headers);
    const authorizationHeader = req.headers["authorization"];
    // const Cookie = req.headers["Cookie"];
    const Cookie =
      "ARRAffinity=ef9aa2e92a300f3166dc402f37bb3d300cbcfa0e93dee478dddb346c20cc359e; ARRAffinitySameSite=ef9aa2e92a300f3166dc402f37bb3d300cbcfa0e93dee478dddb346c20cc359e";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authorizationHeader}`, // Add your authorization token here
      Cookie,
    };

    try {
      const response = await axios.get(url, {
        headers,
      });
      logger.info(response.data);
      resolve({
        status: "200",
        data: response.data,
        message: "Data fetched Successfully",
      });
    } catch (error) {
      console.error("Error making API request:", error.message);
      resolve({
        status: "500",
        data: [],
        error,
        message: error.code,
      });
    }
  });
};

const RefundPoints = (req, res) => {
  return new Promise(async (resolve, reject) => {
    const postData = {
      ...req.body,
    };
    logger.info({ postData });
    logger.info(url);
    logger.info(req.headers);
    const authorizationHeader = req.headers["authorization"];
    // const Cookie = req.headers["Cookie"];
    const Cookie =
      "ARRAffinity=ef9aa2e92a300f3166dc402f37bb3d300cbcfa0e93dee478dddb346c20cc359e; ARRAffinitySameSite=ef9aa2e92a300f3166dc402f37bb3d300cbcfa0e93dee478dddb346c20cc359e";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authorizationHeader}`, // Add your authorization token here
      Cookie,
    };

    try {
      const response = await axios.post(REFUND_POINTS, postData, {
        headers,
      });
      logger.info(response.data);
      if (response.data.Errors) {
        resolve({
          status: "400",
          data: response.data,
          message: "Error while fetching details",
        });
      }
      resolve({
        status: "200",
        data: response.data,
        message: "Data fetched Successfully",
      });
    } catch (error) {
      console.error("Error making API request:", error.message);
      resolve({
        status: "500",
        data: [],
        error,
        message: error.message,
      });
    }
  });
};
const DeductWalletPoints = (req, res) => {
  return new Promise(async (resolve, reject) => {
    const postData = {
      ...req.body,
    };
    const url=DEDUCT_WALLET_POINTS;
    logger.info({ postData });
    logger.info(url);
    logger.info(req.headers);
    const authorizationHeader = req.headers["authorization"];
    // const Cookie = req.headers["Cookie"];
    const Cookie =
      "ARRAffinity=ef9aa2e92a300f3166dc402f37bb3d300cbcfa0e93dee478dddb346c20cc359e; ARRAffinitySameSite=ef9aa2e92a300f3166dc402f37bb3d300cbcfa0e93dee478dddb346c20cc359e";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authorizationHeader}`, // Add your authorization token here
      Cookie,
    };
    try {
      const response = await axios.post(DEDUCT_WALLET_POINTS, postData, {
        headers,
      });
      logger.info(response.data);
      if (response.data.Errors) {
        resolve({
          status: "400",
          data: response.data,
          message: "Error while fetching details",
        });
      }
      resolve({
        status: "200",
        data: response.data,
        message: "Data fetched Successfully",
      });
    } catch (error) {
      console.error("Error making API request:", error.message);
      resolve({
        status: "500",
        data: [],
        error,
        message: error.message,
      });
    }
  });
};
*/
module.exports = {
  // getTrips,
  // getTripById,
  // addTrip,
  addCategory,
  updateCategory,
  getCategoryById,
  deleteCategoryById,
  addOffer,
  updateOffer
  // GetPWAWalletPoints,
  // DeductWalletPoints,
  // RefundPoints,
  // getToken,
};
