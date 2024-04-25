const helpSupportBusiness = require("../businessLogic/helpSupportBusiness");


module.exports.getHelpSupportDetails = (req, res) => {
  helpSupportBusiness.getHelpSupportDetails(req).then((result) => {
    res.json(result);
  });
};
module.exports.getHelpSupportDtlsById = (req, res) => {
  helpSupportBusiness.getHelpSupportDtlsById(req).then((result) => {
    res.json(result);
  });
};

