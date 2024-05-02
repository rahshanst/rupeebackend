const authServices = require("../services/authServices");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const logger = require("../../utils/logger");

module.exports.login = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    const { username, password } = req.body;
    try {
      const userData = await authServices.getUserData(username);
      logger.info(userData.recordset, userData.recordset.length);
      if (userData.recordset.length === 0) {
        resolve({
          status: "404",
          message: "username does not exist",
        });
      }
      logger.info(password, userData.recordset[0].password);
      if (password !== userData.recordset[0].password) {
        resolve({
          status: "401",
          message: "Please enter valid password",
        });
      }

      if (userData.recordset.isLoggedIn) {
        resolve({
          status: "204",
          message: "User already in use",
        });
      }

      const { isLoggedIn, isPasswordChanged, role, uuid } =
        userData.recordset[0];

      // Generate an access token
      const accessToken = jwt.sign({ username }, process.env.SECRET_KEY);
      const sessionCreated = await authServices.addUserSession(
        username,
        accessToken
      );
      logger.info({ sessionCreated });
      resolve({
        status: "200",
        data: {
          token: accessToken,
          isLoggedIn,
          isPasswordChanged,
          role,
          uuid,
          sessionCreated: sessionCreated.rowsAffected[0],
        },
        message: "login success",
      });
    } catch (error) {
      logger.info("Error making API request:", error);
      resolve({
        status: "500",
        data: [],
        error,
        message: error,
      });
    }
  });
};
