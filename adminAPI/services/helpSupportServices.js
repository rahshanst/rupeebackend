const { executeQuery } = require("../../db/executeQuery");


module.exports.getHelpSupportDtlsById = () => {
  const query = `SELECT * from HelpAndSupport`;
  return executeQuery(query);
};
