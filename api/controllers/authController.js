const authBusiness = require("../../adminAPI/businessLogic/authBusiness");

module.exports.login = (req, res) => {
    authBusiness.log  in(req).then((result) => {
    res.json(result);
  });
};