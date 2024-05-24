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
    const fileResult = await uploadFilesToBlob({
      ...req.body,
      ...req.files,
      timestamp,
      folder,
    });
    logger.info({ file_data: fileResult?.url || "" });
    adminServices
      .updateCategory({ ...req.body, file_data: fileResult[0]?.url || "" })
      .then((result) => {
        if (result) {
          resolve({
            status: 200,
            fileResult: fileResult || [],

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

async function handleExcelFile(file, id_offer) {
  const tempFileName = `${Date.now()}_${file[0]?.originalname}`;
  console.log({ tempFileName });
  const tempFilePath = path.join(os.tmpdir(), tempFileName);
  console.log({ tempFilePath }); // Check temporary file path
  fs.writeFileSync(tempFilePath, file[0].buffer);
  const buffer = fs.readFileSync(tempFilePath);
  console.log({ buffer });
  const workbook = xlsx.read(buffer, { type: "buffer" });
  const sheet_name_list = workbook.SheetNames;
  const results = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

  console.log({ results });

  for (const row of results) {
    await adminServices.addCoupon({
      id_offer: id_offer,
      brand_name: row["Brand Name"],
      coupon_code: row["Coupon Code"],
      is_active: row["Active"],
    });
  }
}

async function handleCsvFile(file, id_offer) {
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
          for (const row of results) {
            logger.info({
              id_offer: id_offer,
              brand_name: row["Brand Name"],
              coupon_code: row["Coupon Code"],
              is_active: row["Active"],
            });
            await adminServices.addCoupon({
              id_offer: id_offer,
              brand_name: row["Brand Name"],
              coupon_code: row["Coupon Code"],
              is_active: row["Active"],
            });
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

    let ticketModule = "",
      brand_logoFile = "",
      product_picFile = "",
      couponfileFile = "";
    const { brand_logo, product_pic, coupon_file } = req.files;
    logger.info({ coupon_file });
    if (brand_logo) {
      ticketModule = "brand_logo";
      brand_logoFile = await uploadFilesToBlob({
        ...req.body,
        ...req.files,
        timestamp,
        folder: "Deals",
        file_data: brand_logo,
        ticketModule,
      });
    }
    logger.info({ brand_logoFile });
    if (product_pic) {
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
    }

    if (coupon_file) {
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
    }
    logger.info(
      `Executing query ${{
        ...req.body,
        brand_logo: brand_logoFile[0]?.url,
        product_pic: product_picFile[0]?.url,
        coupon_file: couponfileFile[0]?.url,
      }}`
    );

    const fileExtension = coupon_file[0]?.originalname?.split(".")[1];
    logger.info({ fileExtension });
    if (fileExtension === "xls" || fileExtension === "xlsx") {
      await handleExcelFile(coupon_file, id_offer);
    } else if (fileExtension === "csv") {
      await handleCsvFile(coupon_file, id_offer);
    } else {
      resolve({
        status: 408,
        message: "Unsupported file",
        err: `${err}`,
      });
    }
    adminServices
      .addOffer({
        ...req.body,
        brand_logo: brand_logoFile[0]?.url,
        product_pic: product_picFile[0]?.url,
        coupon_file: couponfileFile[0]?.url,
        coupon_id: id_offer,
      })
      .then((result) => {
        if (result) {
          resolve({
            status: 200,
            brand_logo: brand_logoFile[0]?.url,
            product_pic: product_picFile[0]?.url,
            coupon_file: couponfileFile[0]?.url,
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
  // GetPWAWalletPoints,
  // DeductWalletPoints,
  // RefundPoints,
  // getToken,
};
