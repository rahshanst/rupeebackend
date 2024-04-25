const authBusiness = require("../../adminAPI/businessLogic/authBusiness");

module.exports.login = (req, res) => {
    authBusiness.login(req).then((result) => {
    res.json(result);
  });
};