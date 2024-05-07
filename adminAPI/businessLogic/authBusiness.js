const authServices = require("../services/authServices");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const logger = require("../../utils/logger");
const dayjs = require("dayjs");

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
      const accessToken = jwt.sign({ username }, 'XXKEYXX');
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
          name: userData?.recordset[0]?.name,
          userName: userData?.recordset[0]?.username,
          email: userData?.recordset[0]?.email,
          avatar: userData?.recordset[0]?.avatar || "",
          date: dayjs().format("DD/MM/YYYY HH:mm:ss A"),
          sessionCreated: sessionCreated?.rowsAffected[0],
          authority: [role],
        },
        message: "login success",
      });
    } catch (error) {
      logger.info("Error making API request:", error);
      resolve({
        status: "500",
        data: [],
        error,
        message: error.code,
      });
    }
  });
};

module.exports.getUserSetting = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    logger.info(req.body);
    try {
      const userData = await authServices.getUserSetting(req.body.username);
      if (userData.error) {
        resolve({
          status: "500",
          data: [],
          error: userData.error.info,
          message: "Internal server error",
        });
      }
      if (userData.recordset) {
        resolve({
          status: "200",
          data: {
            uuid: userData?.recordset[0]?.uuid,
            name: userData?.recordset[0]?.name,
            userName: userData?.recordset[0]?.username,
            email: userData?.recordset[0]?.email,
            avatar: userData?.recordset[0]?.avatar || "",
            date: dayjs().format("DD/MM/YYYY HH:mm:ss A"),
          },
          message: "Record fetched successfully",
        });
      } else {
        resolve({
          status: "404",
          data: [],
          message: "No result found",
        });
      }
    } catch (error) {
      logger.info("Error making API request:", error);
      resolve({
        status: "500",
        data: [],
        error,
        message: error.code,
      });
    }
  });
};

module.exports.updateuserData = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    logger.info(req.body);
    try {
      const userData = await authServices.updateuserData(req.body);
      if (userData.error) {
        resolve({
          status: "500",
          data: [],
          error: userData.error.info,
          message: "Internal server error",
        });
      }
      if (userData) {
        resolve({
          status: "200",
          data: userData?.rowsAffected ? true:false,
          message: "Record fetched successfully",
        });
      } else {
        resolve({
          status: "404",
          data: [],
          message: "No result found",
        });
      }
    } catch (error) {
      logger.info("Error making API request:", error);
      resolve({
        status: "500",
        data: [],
        error,
        message: error.code,
      });
    }
  });
};
module.exports.changePassword = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    const { username, oldPassword, newPassword } = req.body;
    logger.info(req.body);
    try {
      const userData = await authServices.getUserPassword(username);
      logger.info(userData.recordset, userData.recordset.length);
      console.log({newPassword, oldPassword},userData.recordset[0].password);
      if (oldPassword !== userData.recordset[0].password) {
        return resolve({
          status: "401",
          message: "Please enter valid password",
        });
      }
      const result = await authServices.changePassword(req.body);
      if (result.error) {
        resolve({
          status: "500",
          data: [],
          error: result.error.info,
          message: "Internal server error",
        });
      }
      if (result) {
        resolve({
          status: "200",
          data: userData?.rowsAffected ? true:false,
          message: "Record fetched successfully",
        });
      } else {
        resolve({
          status: "404",
          data: [],
          message: "No result found",
        });
      }
    } catch (error) {
      logger.info("Error making API request:", error);
      resolve({
        status: "500",
        data: [],
        error,
        message: error.code,
      });
    }
  });
};
