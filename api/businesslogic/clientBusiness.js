// controllers/TripController.js
const userServices = require("../services/clientservices");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

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
const initiateSession =  (req, res) => {
  return new Promise( async(resolve, reject) => {
    const ticketid = uuidv4();
    let Trip = { ticketid, ...req.body };

    // Generate an access token
    const accessToken = jwt.sign({ ticketid }, 'process.env.SECRET_KEY', {
      expiresIn: "15m",
    });

    const token= await getToken();

   // console.log({token})

    userServices.initiateSession(Trip).then((result) => {
      if (result) {
        resolve({
          status: 200,
          token: token.data,
          date: new Date(),
          isTicketBooked: false,
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

const getToken = (req, res) => {
  return new Promise(async (resolve, reject) => {
    const url = 'https://restapi-stage.cheggout.com/api/v1.2/RefreshToken?chegcustomerid=1682327777421000';
    console.log(url);
    const Cookie =
      "ARRAffinity=ef9aa2e92a300f3166dc402f37bb3d300cbcfa0e93dee478dddb346c20cc359e; ARRAffinitySameSite=ef9aa2e92a300f3166dc402f37bb3d300cbcfa0e93dee478dddb346c20cc359e";
    const headers = {
      "Content-Type": "application/json",
      Cookie,
    };
    console.log({ headers });
    try {
      const response = await axios.get(url, {
        headers,
      });
      console.log(response.data);
      resolve({
        status: 200,
        data: response.data,
        message: "Data fetched Successfully",
      });
    } catch (error) {
      console.error("Error making API request:", error.message);
      resolve({
        status: 500,
        data: [],
        error,
        message: error.code,
      });
    }
  });
};

const getCategories = (req, res) => {
  return new Promise((resolve, reject) => {
    userServices.getCategories().then((result) => {
      console.log(result.recordset)
      if (result.recordset[0]) {
        resolve({
          status: 200,
          data: result.recordset,
          message: "Fetched Successfully",
        });
      } else {
        resolve({
          status: 400,
          data: [],
          message: "Data not found.",
        });
      }
    });
  });
};

const getOffers = (req, res) => {
  return new Promise((resolve, reject) => {
    userServices.getOffers().then((result) => {
      console.log(result.recordset)
      if (result.recordset[0]) {
        
        result.recordset.forEach(element => {
          if(element.offer_banner_sm){
          element.offer_banner_sm =  "https://onerupee-store-api-stage.azurewebsites.net/uploads/"+element?.offer_banner_sm;
          }
        });

        resolve({
          status: 200,
          data: result.recordset,
          message: "Fetched Successfully",
        });
      } else {
        resolve({
          status: 400,
          data: [],
          message: "Data not found.",
        });
      }
    });
  });
};

const getOfferDetails =  (req, res) => {
  return new Promise( async(resolve, reject) => {
    let incomingData = { ...req.body };

    userServices.getOfferDetails(incomingData).then((result) => {
      if (result.recordset[0]) {

        result.recordset.forEach(element => {
          if(element.offer_banner_lg){
          element.offer_banner_lg =  "https://onerupee-store-api-stage.azurewebsites.net/uploads/"+element?.offer_banner_lg;
          }
          if(element.offer_banner_xl){
            element.offer_banner_xl =  "https://onerupee-store-api-stage.azurewebsites.net/localhost:9000/uploads/"+element?.offer_banner_xl;
            }
        });

        resolve({
          status: 200,
          data: result.recordset,
          message: "Fetched Successfully",
        });
      }
      resolve({
        status: 400,
        data: [],
        message: "Unable to fetch record",
      });
      
    });
  });
};

const getCouponcode =  (req, res) => {
  return new Promise( async(resolve, reject) => {
    const user_id = 'user2';
    const coupon_code = 'dummycoupn';
    let incomingData = { user_id, coupon_code, ...req.body };

    userServices.getCouponcode(incomingData).then((result) => {
      if (result) {
        resolve({
          status: 200,
          data: 'dummycoupn',//result.recordset,
          message: "Fetched Successfully",
        });
      }
      resolve({
        status: 400,
        data: [],
        message: "Unable to fetch coupon",
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
  initiateSession,
  getCategories,
  getOffers,
  getOfferDetails,
  getCouponcode,
 // GetPwaRewards,
 // GetPWAWalletPoints,
 // DeductWalletPoints,
 // RefundPoints,
 // getToken,
};
