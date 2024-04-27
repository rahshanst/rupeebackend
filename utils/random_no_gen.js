const logger = require("./logger");

function generateRandomNumber() {
  return Math.floor(Math.random() * 1000);
}

function generateRandomID() {
  const currentYear = new Date().getFullYear().toString().slice(-2);
  const randomLetters = generateRandomLetters(2);
  const randomNumber = generateRandomNumber();
  const timestamp = Date.now();

  const randomID = `TRPF${randomLetters}${currentYear}${randomNumber}${timestamp}`;

  return randomID;
}

function generateRandomLetters(length) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let randomString = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * letters.length);
    randomString += letters.charAt(randomIndex);
  }

  return randomString;
}

// Example usage
const randomId = generateRandomID();
logger.info(randomId);

module.exports = { randomId };
