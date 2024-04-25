const { executeQuery } = require("../../db/executeQuery");


module.exports.getActiveOfferDtlsById = () => {
  const query = `SELECT * from ActiveOffers`;
  return executeQuery(query);
};