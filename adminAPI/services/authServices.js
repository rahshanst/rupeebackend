const { executeQuery } = require("../../db/executeQuery");

module.exports.getUserData = (username) => {
  const query = `SELECT password,isLoggedIn,isPasswordChanged,role,username,uuid FROM  users WHERE username = '${username}' and isActive=1 and isDeleted=0`;
  return executeQuery(query);
};

module.exports.addUserSession = (username,token) => {
  const query = `INSERT INTO user_session (username, token, loggedInAt) VALUES ('${username}', '${token}', GETDATE());`;
  return executeQuery(query);
};
