// controllers/TripController.js
const adminServices = require("../services/adminservices");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const { uploadFile } = require("../../utils/azureBlobFile");
//const multer  = require('multer')

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
    console.log("req.body.id", req.body.tripId);
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

const addCategory =  (req, res) => {
  return new Promise( async(resolve, reject) => {
    
    let incomingData = { ...req.body };
   
    adminServices.addCategory(incomingData).then((result) => {
      if (result) {
        resolve({
          status: 200,
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

const addOffer =  (req, res) => {
  return new Promise( async(resolve, reject) => {
    
    let incomingData = { ...req.body };
    
    adminServices.addOffer(incomingData).then((result) => {
      if (result) {
        resolve({
          status: 200,
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
    console.log(url);
    console.log(req.headers);
    const authorizationHeader = req.headers["authorization"];
    // const Cookie = req.headers["Cookie"];
    const Cookie =
      "ARRAffinity=ef9aa2e92a300f3166dc402f37bb3d300cbcfa0e93dee478dddb346c20cc359e; ARRAffinitySameSite=ef9aa2e92a300f3166dc402f37bb3d300cbcfa0e93dee478dddb346c20cc359e";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authorizationHeader}`, // Add your authorization token here
      Cookie,
    };
    console.log({ headers });
    try {
      const response = await axios.get(url, {
        headers,
      });
      console.log(response.data);
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
    console.log(url);
    console.log(req.headers);
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
      console.log(response.data);
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
    console.log({ postData });
    console.log(url);
    console.log(req.headers);
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
      console.log(response.data);
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
    console.log({ postData });
    console.log(url);
    console.log(req.headers);
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
      console.log(response.data);
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
  addOffer,
 // GetPWAWalletPoints,
 // DeductWalletPoints,
 // RefundPoints,
 // getToken,
};
