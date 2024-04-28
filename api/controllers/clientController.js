// controllers/TripController.js
const clientBusiness = require("../businesslogic/clientBusiness");
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
const initiateSession = (req, res) => {
  clientBusiness.initiateSession(req).then((result) => {
    res.status(201).json(result);
  });
};

const getCategories = (_, res) => {
  clientBusiness.getCategories().then((result) => {
    res.json(result);
  });
};

const getOffers = (_, res) => {
  clientBusiness.getOffers().then((result) => {
    res.json(result);
  });
};

const getOfferDetails = (req, res) => {
  clientBusiness.getOfferDetails(req).then((result) => {
    res.status(201).json(result);
  });
};

const getCouponcode = (req, res) => {
  clientBusiness.getCouponcode(req).then((result) => {
    res.status(201).json(result);
  });
};

const validationCheck = (req, res) => {
  clientBusiness.validationCheck(req).then((result) => {
    res.status(201).json(result);
  });
};

const checkPaymentStatus = (req, res) => {
  clientBusiness.checkPaymentStatus(req).then((result) => {
    res.status(201).json(result);
  });
};

const GetPwaRewards = (req, res) => {
  clientBusiness.GetPwaRewards(req).then((result) => {
    res.status(201).json(result);
  });
};

const GetPWAWalletPoints = (req, res) => {
  clientBusiness.GetPWAWalletPoints(req).then((result) => {
    res.status(201).json(result);
  });
};

const DeductWalletPoints = (req, res) => {
  clientBusiness.DeductWalletPoints(req).then((result) => {
    res.status(201).json(result);
  });
};

module.exports = {
 // getTrips,
 // getTripById,
 // addTrip,
  initiateSession,
  getCategories,
  getOffers,
  getOfferDetails,
  getCouponcode,
  validationCheck,
  checkPaymentStatus,
  GetPwaRewards,
  GetPWAWalletPoints,
  DeductWalletPoints,
 // RefundPoints,
};
