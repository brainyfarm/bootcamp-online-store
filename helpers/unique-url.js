/**
 * uniqueUrl
 * Generates a unique four-digit string.
 */
const uniqueUrl = (function (min, max) {
  const randomChar = function () {
    return String.fromCharCode(Math.floor(Math.random() * (max - min + 1) + min));
  };
  return [
    randomChar(),
    randomChar().toLowerCase(),
    randomChar(),
    randomChar().toLowerCase()].join("");
})(65, 77);

module.exports = uniqueUrl;