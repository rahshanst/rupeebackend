const activeOffersBusiness = require("../businessLogic/activeOffersBusiness");
module.exports.getActiveOfferDetails = (req, res) => {
  activeOffersBusiness.getActiveOfferDetails(req).then((result) => {
      res.json(result);
    });
  };
  module.exports.getActiveOfferDtlsById = (req, res) => {
    activeOffersBusiness.getActiveOfferDtlsById(req).then((result) => {
        res.json(result);
      });
    };
 