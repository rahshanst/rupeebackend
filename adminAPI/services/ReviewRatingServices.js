const { executeQuery } = require("../../db/executeQuery");


module.exports.getRatingsReviewsDtlsById = () => {
  const query = `SELECT * from CustomerReviews`;
  return executeQuery(query);
};
