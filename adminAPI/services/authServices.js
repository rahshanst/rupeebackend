const { executeQuery } = require("../../db/executeQuery");

module.exports.getUserData = (username) => {
  const query = `SELECT * FROM  users WHERE username = '${username}' and isActive=1 and isDeleted=0`;
  return executeQuery(query);
};

module.exports.getUserSetting = (username) => {
  const query = `SELECT username,name,uuid,role,email,avatar FROM  users WHERE username = '${username}' and isActive=1 and isDeleted=0`;
  return executeQuery(query);
};
module.exports.updateuserData = (data) => {
  const query = `UPDATE users SET name = '${data.name}', email='${data.email}',avatar='${data.avatar}'  WHERE username = '${data.username}' and isActive=1 and isDeleted=0`;
  return executeQuery(query);
};

module.exports.changePassword = (data) => {
  const query = `UPDATE users SET password = '${data.newPassword}'  WHERE username = '${data.username}' and isActive=1 and isDeleted=0`;
  return executeQuery(query);
};

module.exports.getUserPassword = (username) => {
  const query = `SELECT password FROM  users WHERE username = '${username}' and isActive=1 and isDeleted=0`;
  return executeQuery(query);
};

module.exports.addUserSession = (username,token) => {
  const query = `INSERT INTO user_session (username, token, loggedInAt) VALUES ('${username}', '${token}', GETDATE());`;
  return executeQuery(query);
};
