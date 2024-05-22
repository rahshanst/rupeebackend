// controllers/TripController.js

const logger = require("../../utils/logger");
const adminBusiness = require("../businesslogic/adminBusiness");
/*
const getTrips = (_, res) => {
  tripBuisness.getTrips().then((result) => {
    res.json(result);
  });
};

const getTripById = (req, res) => {
  tripBuisness.getTripById(req).then((result) => {
    res.json(result);
  });
};

const addTrip = (req, res) => {
  tripBuisness.addTrip(req).then((result) => {
    res.status(201).json(result);
  });
};

const GetPwaRewards = (req, res) => {
  tripBuisness.GetPwaRewards(req).then((result) => {
    res.status(201).json(result);
  });
};

const GetPWAWalletPoints = (req, res) => {
  tripBuisness.GetPWAWalletPoints(req).then((result) => {
    res.status(201).json(result);
  });
};

const DeductWalletPoints = (req, res) => {
  tripBuisness.DeductWalletPoints(req).then((result) => {
    res.status(201).json(result);
  });
};

const RefundPoints = (req, res) => {
  tripBuisness.RefundPoints(req).then((result) => {
    res.status(201).json(result);
  });
};
*/



const addCategory = (req, res) => {
  adminBusiness.addCategory(req).then((result) => {
    logger.info(`CONTROLLER | addCategory | result | ${result}`)
    res.status(201).json(result);
  });
};

const updateCategory = (req, res) => {
  adminBusiness.updateCategory(req).then((result) => {
    res.status(201).json(result);
  });
};

const getCategoryById = (req, res) => {
  adminBusiness.getCategoryById(req).then((result) => {
    res.status(201).json(result);
  });
};

const deleteCategoryById = (req, res) => {
  adminBusiness.deleteCategoryById(req).then((result) => {
    res.status(201).json(result);
  });
};

const addOffer = (req, res) => {

  adminBusiness.addOffer(req).then((result) => {
    res.status(201).json(result);
  });
  
};

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
};
