const authBusiness = require("../../adminAPI/businessLogic/authBusiness");

module.exports.login = (req, res) => {
    authBusiness.login(req).then((result) => {
    res.json(result);
  });
};
module.exports.getUserSetting = (req, res) => {
    authBusiness.getUserSetting(req).then((result) => {
    res.json(result);
  });
};
module.exports.updateuserData = (req, res) => {
    authBusiness.updateuserData(req).then((result) => {
    res.json(result);
  });
};
module.exports.changePassword = (req, res) => {
    authBusiness.changePassword(req).then((result) => {
    res.json(result);
  });
};