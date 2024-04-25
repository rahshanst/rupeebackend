const ReviewRatingBusiness = require("../businessLogic/ReviewRatingBusiness");
module.exports.getRatingsReviewsDetails = (req, res) => {
  ReviewRatingBusiness.getRatingsReviewsDetails(req).then((result) => {
    res.json(result);
  });
};
  module.exports.getRatingsReviewsDtlsById = (req, res) => {
    ReviewRatingBusiness.getRatingsReviewsDtlsById(req).then((result) => {
      res.json(result);
    });
  };

