class ExpressError extends Error {
  constructor(statusCode, message) {
    super(message); // pass message to Error class
    this.statusCode = statusCode;
  }
}

module.exports = ExpressError;