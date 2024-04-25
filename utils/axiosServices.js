const axios = require("axios");
const logger = require("./logger");

function checkForError(responseString) {
  const { status,statusText } = responseString.response || {}
  console.log(status,statusText);
  return {data:{status,statusText} }
}
module.exports.axiosRequest = async function (config) {
  try {
    const response = await axios(config);
    logger.info(` ${arguments.callee.name}  | axios | response | ${JSON.stringify(response.data)} `);
    return response;
  } catch (error) {
    logger.info(` ${arguments.callee.name}  | axios | catch | error | ${error} |  ${checkForError(error)}`);
    return checkForError(error);
  }
};
